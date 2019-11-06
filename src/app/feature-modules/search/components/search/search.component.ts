import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SearchService, Search } from '../..';
import { SearchBuilder } from '../../services/search.builder';
import { SearchResult } from '../../model/search.result';
import { InformativeDialogComponent } from 'src/app/shared/components/informative-dialog/informative-dialog.component';
import { ProjectIntention } from 'src/app/model/bio/project-intention';

class CheckboxElement implements NamedValue {
  name: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  selectedSearchType: string = null;

  dataSource: SearchResult[];

  displayedColumns: string[] = ['Search term', 'Project summary', 'Allele Intentions', 'Gene Symbol / Location',
    'Project Assignment'];
  selectAllWorkUnits = true;
  panelOpenState = false;
  searchForm: FormGroup;
  searchControl = new FormControl();
  page: any = {};
  workUnits: CheckboxElement[] = [];
  workGroups: CheckboxElement[] = [];
  searchTypes: string[] = [];
  masterSelected: boolean;
  checkedList: any;
  myTextarea: string;
  configurationData: ConfigurationData;

  error;
  isLoading = true;
  isRateLimitReached = false;

  constructor(
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private configurationDataService: ConfigurationDataService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      geneSymbol: ['']
    });

    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.initFiltersValues();
    });
    this.isLoading = true;
    this.getPage(0);
  }

  initFiltersValues(): void {
    this.searchTypes = this.configurationData.searchTypes.map(x => {
      return x;
    });
    this.workUnits = this.configurationData.workUnits.map(x => {
      const workUnit: CheckboxElement = new CheckboxElement();
      workUnit.name = x;
      workUnit.isSelected = true;
      return workUnit;
    });
    this.workGroups = this.configurationData.workGroups.map(x => {
      const workGroup: CheckboxElement = new CheckboxElement();
      workGroup.name = x;
      workGroup.isSelected = true;
      return workGroup;
    });
  }

  public getPage(pageNumber: number): void {
    const geneSymbols = this.getGeneSymbolsAsArray();
    const workUnitsNames = this.getWorkUnitFilter();
    const searchType = this.getSearchType();
    this.isLoading = true;

    const search: Search = SearchBuilder.getInstance()
      .withSearchType(searchType)
      .withInputs(geneSymbols)
      .withWorkUnitsNames(workUnitsNames)
      .build();
    /* tslint:disable:no-string-literal */
    this.searchService.search(search, pageNumber).subscribe(data => {
      this.dataSource = data['results'];
      this.dataSource.map(x => this.buildSearchResultComments(x));
      console.log('dataSource', this.dataSource);

      this.refreshVisibleColumns();
      this.page = data['page'];
      this.error = '';
      this.isLoading = false;
    }, error => {
      this.error = error;
      this.isLoading = false;
    });
    /* tslint:enable:no-string-literal */
  }

  buildSearchResultComments(searcResult: SearchResult): void {
    const result = [];
    if (!searcResult.project) {
      result.push('No projects found');
    } else {
      if (searcResult.comment) {
        result.push(searcResult.comment);
      }
    }
    searcResult.searchResultComments = result;
  }

  private refreshVisibleColumns(): void {
    if (this.getGeneSymbolsAsArray().length === 0) {
      this.displayedColumns = ['Project summary', 'Allele Intentions', 'Gene Symbol / Location',
        'Project Assignment', 'Privacy', 'Access Restriction'];
    } else {
      this.displayedColumns = ['Search term', 'Search Result Comments', 'Project summary', 'Allele Intentions', 'Gene Symbol / Location',
        'Project Assignment', 'Privacy', 'Access Restriction'];
    }
  }

  private getSearchType(): string {
    return this.selectedSearchType;
  }

  private getWorkUnitFilter(): string[] {
    const workUnitSelectAll = document.querySelector('#workUnitsSelectAll') as HTMLInputElement;
    let selectedWorkUnits = [];
    if (!workUnitSelectAll.checked) {
      selectedWorkUnits = this.workUnits.filter(x => x.isSelected).map(element => element.name);
    }
    return selectedWorkUnits;
  }

  private getWorkGroupFilter(): string[] {
    const workGroupSelectAll = document.querySelector('#workGroupsSelectAll') as HTMLInputElement;
    let selectedWorkGroups = [];
    if (!workGroupSelectAll.checked) {
      selectedWorkGroups = this.workGroups.filter(x => x.isSelected).map(element => element.name);
    }
    return selectedWorkGroups;
  }

  getGeneSymbolsAsArray(): string[] {
    if (this.searchForm.get('geneSymbol').value) {
      const input: string = this.searchForm.get('geneSymbol').value;
      const geneSymbols = input.split(',');
      geneSymbols.map(x => x.trim());
      return geneSymbols;
    }
    return [];
  }

  checkUncheckWorkUnits(e) {
    for (const workUnit of this.workUnits) {
      const selector = '#' + this.getIdFromWorkUnitName(workUnit.name);
      const htmlElement = document.querySelector(selector) as HTMLInputElement;
      htmlElement.checked = e.target.checked;
      workUnit.isSelected = e.target.checked;
    }
  }

  checkUncheckWorkGroups(e) {
    for (const workGroup of this.workGroups) {
      const selector = '#' + this.getIdFromWorkGroupName(workGroup.name);
      const htmlElement = document.querySelector(selector) as HTMLInputElement;
      htmlElement.checked = e.target.checked;
      workGroup.isSelected = e.target.checked;
    }
  }

  onCheckedWorkUnitElement(element: any) {
    const isSelected = !element.isSelected;
    element.isSelected = isSelected;
    const workUnitSelectAll = document.querySelector('#workUnitsSelectAll') as HTMLInputElement;
    workUnitSelectAll.checked = this.workUnits.filter(x => x.isSelected).length === this.workUnits.length;

    return isSelected;
  }

  onCheckedWorkGroupElement(element: any) {
    const isSelected = !element.isSelected;
    element.isSelected = isSelected;
    const workGroupSelectAll = document.querySelector('#workGroupsSelectAll') as HTMLInputElement;
    workGroupSelectAll.checked = this.workGroups.filter(x => x.isSelected).length === this.workGroups.length;

    return isSelected;
  }

  onSubmit(e) {
    if (this.validSearch()) {
      this.getPage(0);
    }
  }

  private validSearch(): boolean {
    let isValid = true;
    const input = this.getGeneSymbolsAsArray();
    if (input.length > 0) {
      if (!this.selectedSearchType) {
        isValid = false;
        const dialogRef = this.dialog.open(InformativeDialogComponent, {
          width: '250px',
          data: {
            title: 'Please select a search type',
            text: 'As you have defined an input for the search (' + input + '), you need to stablish a search type.'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
        });
      } else {
        isValid = true;
      }
    }
    console.log('isValid->', isValid);

    return isValid;
  }

  getIdFromWorkUnitName(workUnitName: string) {
    return 'workUnit_' + workUnitName.replace(/\W/g, '_');
  }

  getIdFromWorkGroupName(workGroupName: string) {
    return 'workGroup_' + workGroupName.replace(/\W/g, '_');
  }

  getTargetText(projectIntention: ProjectIntention): string {
    let text = '';
    if ('gene' === projectIntention.intentionTypeName) {
      const intentionByGene = projectIntention.intentionByGene;
      if (intentionByGene && intentionByGene.gene) {
        text = intentionByGene.gene.symbol;
      }
      return text;
    }
  }

}
