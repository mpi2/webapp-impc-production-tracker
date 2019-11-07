import { Component, OnInit, ViewChild } from '@angular/core';
import { FileLoaderService } from 'src/app/core/services/file-loader.service';
import { Gene, TargetListElement, ConsortiumList } from 'src/app/model';
import { TargetGeneListService } from '../../services/target-gene-list.service';
import { Target } from 'src/app/model/bio/target_gene_list/gene-result';
import { ManagedListsService, LoggedUserService, PermissionsService, GeneService } from 'src/app/core';
import { EntityValues } from 'src/app/feature-modules/admin/model/entity-values';
import { MatPaginator, MatDialog } from '@angular/material';
import { User } from 'src/app/core/model/user/user';
import { ImportListDialogComponent } from '../import-list-dialog/import-list-dialog.component';

export class TargetListTableRecord {
  consortiumName: string;
  targetListElement: TargetListElement;
}

@Component({
  selector: 'app-list-management',
  templateUrl: './list-management.component.html',
  styleUrls: ['./list-management.component.css']
})
export class ListManagementComponent implements OnInit {

  public dataSource: TargetListTableRecord[] = [];
  private originalDataAsString: string;
  consortiumLists: ConsortiumList[];

  user: User = undefined;

  currentConsortium: string = undefined;

  consortia: NamedValue[] = [];

  listsByUser: EntityValues[];
  canUpdateList: boolean;

  page: any = {};

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private fileLoaderService: FileLoaderService,
    private targetGeneListService: TargetGeneListService,
    private managedListsService: ManagedListsService,
    private loggedUserService: LoggedUserService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loadPermissions();
    this.getPage(0);
  }

  download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  public getPage(pageNumber: number) {
    this.clearDataSet();
    if (this.currentConsortium) {
      this.targetGeneListService.getListByConsortium(pageNumber, this.currentConsortium).subscribe(data => {
        /* tslint:disable:no-string-literal */
        if (data['_embedded']) {
          const lists = data['_embedded'].listsByConsortium;
          this.page = data['page'];
          /* tslint:enable:no-string-literal */
          this.consortiumLists = lists;
          this.getDataSource(this.consortiumLists);
        }
      });
    }
  }

  onConsortiumChanged() {
    this.getPage(0);
  }

  private clearDataSet() {
    this.dataSource = [];
  }

  loadPermissions(): void {
    this.loggedUserService.getLoggerUser().subscribe(x => {
      this.user = x;
      if (this.user.isAdmin) {
        this.managedListsService.getManagedListsByUser().subscribe(data => {
          this.consortia = this.managedListsService.getValuesByEntity(data, 'consortia');
        });
      } else {
        this.consortia = this.getRelatedConsortia(x);
      }
      this.canUpdateList = PermissionsService.canExecuteAction(x, PermissionsService.MANAGE_GENE_LISTS);
    });
  }

  openImportDialog() {
    const dialogRef = this.dialog.open(ImportListDialogComponent, {
      width: '280px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadDataFromCsv(result);
    });
  }

  export() {
    if (this.currentConsortium) {
      const csv = this.fileLoaderService.jsonToCsv(this.buildJsonCsvFromDataSource());
      const fileName = 'gene_list_' + this.currentConsortium.replace(/\W/g, '_') + '.csv';
      this.download(fileName, csv);
    }
  }

  private getRelatedConsortia(user: User): NamedValue[] {
    console.log('user', user);

    const consortiaNames = [];
    if (user && user.rolesConsortia) {
      user.rolesConsortia.map(x => {
        const element: NamedValue = { name: x.consortiumName };
        consortiaNames.push(element);
      });
    }
    return consortiaNames;
  }

  private getDataSource(consortiumLists: ConsortiumList[]) {
    if (consortiumLists) {
      consortiumLists.forEach(x => {
        const consortiumName = x.consortiumName;
        const list = x.list;
        if (list) {
          list.forEach(element => {
            const targetListTableRecord: TargetListTableRecord = new TargetListTableRecord();
            targetListTableRecord.consortiumName = consortiumName;
            targetListTableRecord.targetListElement = element;
            this.dataSource.push(targetListTableRecord);
          });
        }
      });
    }
    this.originalDataAsString = JSON.stringify(this.dataSource);
  }

  loadDataFromCsv(csvRecords) {
    if (csvRecords) {
      const mappedData = this.buildDataSourceByCsvRecords(csvRecords);
      const consortiumLists = this.buildConsortiumLists(mappedData);
      this.consortiumLists = [...consortiumLists];
      this.getDataSource(this.consortiumLists);
    }
  }

  buildDataSourceByCsvRecords(csvRecords): Map<string, TargetListElement[]> {
    const consortiaNames = this.fileLoaderService.getRecordsByColumn(csvRecords, 'consortium');
    const targets = this.fileLoaderService.getRecordsByColumn(csvRecords, 'target(s)');
    const notes = this.fileLoaderService.getRecordsByColumn(csvRecords, 'note');

    const mappedData: Map<string, TargetListElement[]> = new Map();
    targets.forEach((item, index) => {
      const consortiumName = consortiaNames[index];
      const geneSymbols = item.split(',');
      const note = notes[index];
      const targetListElement = this.buildTargetListElement(geneSymbols, note);

      if (mappedData.get(consortiumName)) {
        const consortiumData = mappedData.get(consortiumName);
        consortiumData.push(targetListElement);
      } else {
        mappedData.set(consortiumName, [targetListElement]);
      }
    });
    return mappedData;
  }

  buildTargetListElement(geneSymbols: string[], note) {
    const targetListElement: TargetListElement = new TargetListElement();
    const genes: Gene[] = [];
    if (geneSymbols) {
      geneSymbols.map(x => {
        const gene = new Gene();
        gene.symbol = x;
        genes.push(gene);
      });
    }
    const genesResults: Target[] = genes.map(x => ({ gene: x }));
    targetListElement.targets = genesResults;
    targetListElement.note = note;
    return targetListElement;
  }

  buildConsortiumLists(mappedData: Map<string, TargetListElement[]>): ConsortiumList[] {
    const consortiumLists: ConsortiumList[] = [];
    mappedData.forEach((value, key) => {
      const consortiumList: ConsortiumList = new ConsortiumList();
      consortiumList.consortiumName = key;
      consortiumList.list = value;
      consortiumLists.push(consortiumList);
    });
    return consortiumLists;
  }

  buildJsonCsvFromDataSource() {
    const fields = ['Target(s)', 'Note'];
    const data = [];
    this.dataSource.forEach(x => {
      const dataRecord: string[] = [];
      const symbolNames = x.targetListElement.targets.map(y => y.gene.symbol).join(',');
      const note = x.targetListElement.note;
      dataRecord.push(symbolNames);
      dataRecord.push(note);
      data.push(dataRecord);
    });
    return { fields, data };
  }

  public getGenesSymbols(targetListTableRecord: TargetListTableRecord): string[] {
    const targetsByRecord: Target[] = targetListTableRecord.targetListElement.targets;
    return targetsByRecord.map(x => x.gene.symbol);
  }

  updateLists() {
    console.log('to be implemented');
    const changed = this.originalDataAsString !== JSON.stringify(this.dataSource);
    console.log('changed:', changed);
    console.log(
      'current dataSource genes',
      this.dataSource
        .map(x => x.targetListElement.targets
          .map(y => y.gene ? y.gene.symbol : 'deleted').join('|')));
  }

}
