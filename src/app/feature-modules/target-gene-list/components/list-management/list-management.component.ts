import { Component, OnInit, ViewChild } from '@angular/core';
import { TargetGeneListService } from '../../services/target-gene-list.service';
import { ManagedListsService, LoggedUserService, PermissionsService, GeneService } from 'src/app/core';
import { EntityValues } from 'src/app/feature-modules/admin/model/entity-values';
import { MatPaginator, MatDialog } from '@angular/material';
import { User } from 'src/app/core/model/user/user';
import { ImportListDialogComponent } from '../import-list-dialog/import-list-dialog.component';
import { GeneListRecord } from 'src/app/model/bio/target_gene_list/gene-list-record';

@Component({
  selector: 'app-list-management',
  templateUrl: './list-management.component.html',
  styleUrls: ['./list-management.component.css']
})
export class ListManagementComponent implements OnInit {

  public dataSource: GeneListRecord[] = [];
  private originalDataAsString: string;
  private  originalRecordsStrings: Map<number, string> = new Map();
  geneListRecords: GeneListRecord[];

  user: User = undefined;

  currentConsortium: string = undefined;

  consortia: NamedValue[] = [];

  listsByUser: EntityValues[];
  canUpdateList: boolean;

  page: any = {};

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
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
    console.log('calling getPage', pageNumber);

    this.clearDataSet();
    if (this.currentConsortium) {
      this.targetGeneListService.getListByConsortium(pageNumber, this.currentConsortium).subscribe(data => {
        this.extractDataFromServerResponse(data);
      });
    }
  }

  private extractDataFromServerResponse(data) {
     /* tslint:disable:no-string-literal */
    if (data['_embedded']) {
      const records = data['_embedded'].records;
      this.page = data['page'];
      /* tslint:enable:no-string-literal */
      this.geneListRecords = records;
      this.getDataSource(this.geneListRecords);
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
      this.updateListWithFile(result);
    });
  }

  updateListWithFile($event) {
    const input = $event.target;
    const file = input.files[0];
    this.targetGeneListService.updateListWithFile(this.currentConsortium, file).subscribe(data => {
      console.log('data import', data);

      this.extractDataFromServerResponse(data);
      console.log('Now datasource===', this.dataSource);


    }, error => {
      console.log('error', error);

    });

  }

  export() {
    if (this.currentConsortium) {
      // const csv = this.fileLoaderService.jsonToCsv(this.buildJsonCsvFromDataSource());
      // const fileName = 'gene_list_' + this.currentConsortium.replace(/\W/g, '_') + '.csv';
      // this.download(fileName, csv);
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

  private getDataSource(geneListRecords: GeneListRecord[]) {
    this.dataSource = geneListRecords;
    this.dataSource.forEach(x =>  {
      this.originalRecordsStrings.set(x.id, JSON.stringify(x));
    });
    console.log('this.dataSource', this.dataSource);


    this.originalDataAsString = JSON.stringify(this.dataSource);
  }

  public getGenesSymbols(geneListRecord: GeneListRecord): string[] {
    return geneListRecord.genes.map(x => x.symbol);
  }

  noteChanged(element: GeneListRecord, newValue) {
    element.note = newValue;
  }

  updateLists() {
    const dataToUpload: GeneListRecord[] = [];

    this.dataSource.forEach(x => {
      const originalRecordAsString = this.originalRecordsStrings.get(x.id);
      if (originalRecordAsString) {
        const newRecordAsString = JSON.stringify(x);
        if (originalRecordAsString !== newRecordAsString) {
          dataToUpload.push(x);
        }
      } else {
        dataToUpload.push(x);
      }
    });
    console.log('dataToUpload::::::', dataToUpload);
    this.targetGeneListService.uploadList(dataToUpload, this.currentConsortium).subscribe(data => {
      console.log('data', data);
      // this.extractDataFromServerResponse(data);
     // this.getPage(0);

    }, error => {
      console.error('there was an error', error);

    });
  }

}
