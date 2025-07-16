import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GeneListRecord } from 'src/app/model';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { TargetGeneListService } from '../../services/target-gene-list.service';
import { FilterService } from 'src/app/feature-modules/filters/services/filter.service';
import { merge, of } from 'rxjs';
import { startWith, switchMap, catchError } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/message.service';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Page } from 'src/app/model/page_structure/page';
import { Sort } from 'src/app/model/page_structure/sort';

@Component({
    selector: 'app-list-content',
    templateUrl: './list-content.component.html',
    styleUrls: ['./list-content.component.css'],
    standalone: false
})
export class ListContentComponent implements OnInit, AfterViewInit, OnDestroy {


  @Input() canUpdateList;
  @Input() currentSelectedEditMode;
  @Output() errorEventEmitter = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  currentConsortium;
  isLoading;
  isDownloading;
  error;

  dataSource: GeneListRecord[] = [];
  recordIdsToDelete = [];
  lastNewId = -1;
  configurationData: ConfigurationData;
  recordTypesByConsortium = new Map<string, NamedValue[]>();
  filteredRecordTypes: NamedValue[];
  messageSubscription;

  sort: Sort = { property: 'id', direction: 'ASC' };
  // eslint-disable-next-line id-blacklist
  page: Page = { number: 0, size: 20, sorts: [this.sort] };

  private originalDataAsString: string;
  private originalRecordsStrings: Map<number, string> = new Map();

  constructor(
    private targetGeneListService: TargetGeneListService,
    private filterService: FilterService,
    private messageService: MessageService,
    private configurationDataService: ConfigurationDataService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loadConfigurationData();
    this.messageSubscription = this.messageService.getMessage().subscribe(data => {
      if (data.message) {
        this.resetPage();
        this.currentConsortium = data.message.geneListSelectedConsortium;
        this.filteredRecordTypes = this.recordTypesByConsortium.get(this.currentConsortium);
        this.getPage(this.page);
      }
    });
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    merge(
      this.filterService.filterChange
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.clearDataSet();
          return this.targetGeneListService.getListByConsortium(this.page, this.currentConsortium, this.filterService.filter);
        }),
        catchError(() => of([]))
      )
      .subscribe(data => {
        this.extractDataFromServerResponse(data);
      });
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      Object.keys(this.configurationData.recordTypesByConsortium).map(key => {
        const list = this.configurationData.recordTypesByConsortium[key];
        this.recordTypesByConsortium.set(key, list.map(x => ({ name: x })));
      });

    }, error => {
      this.error = error;
    });
  }

  public getPage(page: Page) {
    this.isLoading = true;
    this.clearDataSet();
    if (this.currentConsortium) {
      this.targetGeneListService.getListByConsortium(page, this.currentConsortium, null).subscribe(data => {
        this.isLoading = false;
        this.extractDataFromServerResponse(data);
      }, error => {
        this.isLoading = false;
        this.error = error;
      });
    }
  }

  checkEditable() {
    return this.canUpdateList && this.currentSelectedEditMode;
  }

  public getGenesSymbols(geneListRecord: GeneListRecord): string[] {
    return geneListRecord.genes.map(x => x.symbol);
  }

  noteChanged(element: GeneListRecord, newValue) {
    element.note = newValue;
  }

  onClickToDeleteElement(record: GeneListRecord) {
    if (record.id) {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        width: '250px',
        data: { confirmed: false }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.recordIdsToDelete.push(record.id);
          this.dataSource = this.dataSource.filter(x => x.tmpId !== record.tmpId);
        }
      });
    }
  }

  addRow() {
    const geneListRecord = new GeneListRecord();
    geneListRecord.id = this.lastNewId--;
    geneListRecord.genes = [];
    geneListRecord.note = '';
    this.dataSource.push(geneListRecord);
  }

  checkIfChanged() {
    return JSON.stringify(this.dataSource) !== this.originalDataAsString;
  }

  updateLists() {
    this.isLoading = true;
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
    this.cleanPayload(dataToUpload);

    this.targetGeneListService.uploadList(dataToUpload, this.currentConsortium).subscribe(data => {
      this.extractDataFromServerResponse(data);
      this.getPage(this.page);
      this.snackBar.open('Data updated.', 'Close', {
        duration: 1500,
      });
      this.isLoading = false;

    }, error => {
      console.error('there was an error', error);
      this.errorEventEmitter.emit(error);
      this.isLoading = false;
    });

    if (this.recordIdsToDelete.length > 0) {
      this.targetGeneListService.deleteRecords(this.recordIdsToDelete, this.currentConsortium).subscribe(data => {
        this.getPage(this.page);
      },
        error => {
          this.error = error;
          this.errorEventEmitter.emit(error);
        });
    }
  }

  // Removes data that don't need to be send to the server because are calculated information.
  cleanPayload(dataToUpload: GeneListRecord[]) {
    dataToUpload.map(x => {
      x.projects = null;
      if (x.id < 0) {
        x.id = null;
      }
    });
  }

  public updateListWithFile(file) {
    this.targetGeneListService.updateListWithFile(this.currentConsortium, file).subscribe(data => {
      this.getPage(this.page);
      this.errorEventEmitter.emit('');
    }, error => {
      console.error('error', error);
      this.errorEventEmitter.emit(error);
    });
  }

  calculateRowspan(element: GeneListRecord) {
    if (element.projects && element.projects.length > 0) {
      return element.projects.length;
    }
    return 1;
  }

  downloadCsv() {
    this.isDownloading = true;
    this.targetGeneListService.exportCsv(this.currentConsortium, this.filterService.filter)
      .subscribe(data => {
        this.download('gene_list_' + this.currentConsortium + '.csv', data);
        this.isDownloading = false;
      }, error => {
        console.error(error);
        this.isDownloading = false;
      });
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

  public onPaginatorChanged(paginator: MatPaginator) {
    // eslint-disable-next-line id-blacklist
    this.page.number = paginator.pageIndex;
    this.page.size = paginator.pageSize;
    this.getPage(this.page);
  }

  private clearDataSet() {
    this.dataSource = [];
  }

  private extractDataFromServerResponse(data) {
    if (data) {
      if (data['_embedded']) {
        const records = data['_embedded'].records;
        this.page = data['page'];
        this.getDataSource(records);
      }
    } else {
      this.resetPage();
      this.dataSource = [];
    }
  }

  private getDataSource(geneListRecords: GeneListRecord[]) {
    this.dataSource = geneListRecords;
    this.dataSource.forEach(x => {
      x.tmpId = x.id;
      this.originalRecordsStrings.set(x.id, JSON.stringify(x));
    });
    this.originalDataAsString = JSON.stringify(this.dataSource);
  }

  private resetPage() {
    // eslint-disable-next-line id-blacklist
    this.page.number = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

}
