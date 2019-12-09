import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { GeneListRecord } from 'src/app/model';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { MatDialog, MatPaginator } from '@angular/material';
import { TargetGeneListService } from '../../services/target-gene-list.service';
import { FilterService } from 'src/app/feature-modules/filters/services/filter.service';
import { merge, of } from 'rxjs';
import { startWith, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-list-content',
  templateUrl: './list-content.component.html',
  styleUrls: ['./list-content.component.css']
})
export class ListContentComponent implements OnInit,  AfterViewInit {

  @Input() currentConsortium;
  @Input() canUpdateList;
  @Input() currentSelectedEditMode;

  dataSource: GeneListRecord[] = [];
  recordIdsToDelete = [];
  error;
  lastNewId = -1;
  page: any = {};
  private originalDataAsString: string;
  private originalRecordsStrings: Map<number, string> = new Map();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private targetGeneListService: TargetGeneListService,
    private filterService: FilterService,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    merge(
      this.filterService.filterChange
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.clearDataSet();
          return this.targetGeneListService.getListByConsortium(0, this.currentConsortium, this.filterService.filter);
        }),
        catchError(() => {
          return of([]);
        })
      )
      .subscribe(data => {
        this.extractDataFromServerResponse(data);
      });
  }

  public getPage(pageNumber: number) {
    this.clearDataSet();
    if (this.currentConsortium) {
      this.targetGeneListService.getListByConsortium(pageNumber, this.currentConsortium, null).subscribe(data => {
        this.extractDataFromServerResponse(data);
      });
    }
  }

  private clearDataSet() {
    this.dataSource = [];
  }

  private extractDataFromServerResponse(data) {
    if (data) {
      /* tslint:disable:no-string-literal */
      if (data['_embedded']) {
        const records = data['_embedded'].records;
        this.page = data['page'];
        /* tslint:enable:no-string-literal */
        this.getDataSource(records);
      }
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
          console.log('delete!!');
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
    console.log('dataToUpload:', dataToUpload);

    this.targetGeneListService.uploadList(dataToUpload, this.currentConsortium).subscribe(data => {
      this.extractDataFromServerResponse(data);
      this.getPage(0);

    }, error => {
      console.error('there was an error', error);

    });

    if (this.recordIdsToDelete.length > 0) {
      this.targetGeneListService.deleteRecords(this.recordIdsToDelete, this.currentConsortium).subscribe(data => {
      },
      error => {
        this.error = error;
      });
    }
  }

  // Removes data that don't need to be send to the server because are calculated information.
  cleanPayload(dataToUpload: GeneListRecord[]) {
    dataToUpload.map(x => {
      x.projects = null;
    });
  }

  public updateListWithFile(file) {
    this.targetGeneListService.updateListWithFile(this.currentConsortium, file).subscribe(data => {
      // this.extractDataFromServerResponse(data);
      this.getPage(0);
    }, error => {
      console.error('error', error);
    });
  }

}
