import { Component, OnInit } from '@angular/core';
import { FileLoaderService } from 'src/app/core/services/file-loader.service';
import { Gene, TargetListElement, ConsortiumList, ProjectByTargetGeneSummary } from 'src/app/model';
import { TargetGeneListService } from '../../services/target-gene-list.service';
import { Target } from 'src/app/model/bio/target_gene_list/gene-result';
import { ManagedListsService, LoggedUserService, PermissionsService, GeneService } from 'src/app/core';
import { EntityValues } from 'src/app/feature-modules/admin/model/entity-values';
import { map, flatMap, startWith } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

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
  consortiumLists: ConsortiumList[];

  consortia: NamedValue[] = [];

  listsByUser: EntityValues[];
  canUpdateList: boolean;

  form: FormGroup;
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  readonly GENE_SYMBOL_LENGTH_THRESHOLD = 3;

  constructor(
    private fileLoaderService: FileLoaderService,
    private formBuilder: FormBuilder,
    private targetGeneListService: TargetGeneListService,
    private managedListsService: ManagedListsService,
    private loggedUserService: LoggedUserService,
    private permissionsService: PermissionsService,
    private geneService: GeneService) { }

  ngOnInit() {

    this.buildControlsByEachRow();
    this.form = this.formBuilder.group({
    });
    this.loadPermissions();
    this.targetGeneListService.getAll().subscribe(data => {
      /* tslint:disable:no-string-literal */
      const lists = data['_embedded'].listsByConsortium;
      /* tslint:enable:no-string-literal */

      this.consortiumLists = lists;
      this.getDataSource(this.consortiumLists);
    });
  }

  onFocus(e) {
    this.resetGeneSymbolValuesIfNeeded(e.target.value);
  }

  onFocusOut(e) {
    this.resetGeneSymbolValuesIfNeeded(e.target.value);
  }

  resetGeneSymbolValuesIfNeeded(value: string) {
    if (value.length < this.GENE_SYMBOL_LENGTH_THRESHOLD) {
      this.resetGeneSymbolSuggestionList();
    }
  }

  resetGeneSymbolSuggestionList() {
    this.options = [];
    this.filteredOptions = of([]);
  }

  onSearchChange(v: string) {
    this.resetGeneSymbolValuesIfNeeded(v);
    if (v.length === this.GENE_SYMBOL_LENGTH_THRESHOLD) {
      this.geneService.findGenesNamesStartingWith(v).subscribe(x => {
        this.options = x;
        this.filteredOptions = of(x);
      });
    } else {
      this.filteredOptions = of(this.filter(v));
    }
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  get f() { return this.form.controls; }

  buildControlsByEachRow() {
    const group = {};
    this.dataSource.forEach(element => {
      const consortiumFormName = 'consortiumForm_' + element.targetListElement.id;
      const genesFormName = 'genesForm_' + element.targetListElement.id;
      group[consortiumFormName] = new FormControl('');
      group[genesFormName] = new FormControl('');
    });
    this.form = new FormGroup(group);
  }

  loadPermissions(): void {
    this.loggedUserService.getLoggerUser().subscribe(x => {
      this.canUpdateList = PermissionsService.canExecuteAction(x, PermissionsService.MANAGE_GENE_LISTS);
      if (this.canUpdateList) {
        this.managedListsService.getManagedListsByUser().subscribe(data => {
          this.listsByUser = data;
          this.initLists();
        });
      }
    });
  }

  private initLists() {
    this.consortia = this.managedListsService.getValuesByEntity(this.listsByUser, 'consortia');
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
    this.buildControlsByEachRow();
  }

  changeLists(csvRecords) {
    const mappedData = this.buildDataSourceByCsvRecords(csvRecords);
    const consortiumLists = this.buildConsortiumLists(mappedData);
    this.consortiumLists = [...consortiumLists];
    this.getDataSource(this.consortiumLists);
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

  public getGenesSymbols(targetListTableRecord: TargetListTableRecord): string[] {
    const targetsByRecord: Target[] = targetListTableRecord.targetListElement.targets;
    return targetsByRecord.map(x => x.gene.symbol);
  }

  updateLists() {
    console.log('to be implemented');
  }

}
