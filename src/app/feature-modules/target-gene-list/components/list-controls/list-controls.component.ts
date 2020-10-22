import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FilterService } from 'src/app/feature-modules/filters/services/filter.service';
import { TargetGeneListService } from '../../services/target-gene-list.service';
import { ImportListDialogComponent } from '../import-list-dialog/import-list-dialog.component';

@Component({
  selector: 'app-list-controls',
  templateUrl: './list-controls.component.html',
  styleUrls: ['./list-controls.component.css']
})
export class ListControlsComponent implements OnInit, OnDestroy {
  @Input() canUpdateList;
  @Input() currentConsortium;

  @Output() importFileSelected = new EventEmitter<any>();
  @Output() editModeChanged = new EventEmitter<boolean>();

  downloading;

  currentSelectedEditMode = false;
  newEditMode = 'edit';

  currentFilters: any = {};
  filterChangesSubscription;
  messageSubscription;

  constructor(
    public dialog: MatDialog,
    private filterService: FilterService,
    private targetGeneListService: TargetGeneListService) { }

  ngOnInit() {
    this.subscribeToFilterChanges();
  }

  ngOnDestroy() {
    this.filterChangesSubscription.unsubscribe();
  }

  private subscribeToFilterChanges() {
    this.filterChangesSubscription =
      this.filterService.filterChange.subscribe(filters => {
        this.currentFilters = filters;
      });
  }

  checkEditable() {
    return this.canUpdateList && this.currentSelectedEditMode;
  }

  changeViewMode(e: MatSlideToggleChange) {
    this.newEditMode = e.checked ? 'view' : 'edit';
    this.currentSelectedEditMode = e.checked;
    this.editModeChanged.emit(this.currentSelectedEditMode);
  }

  openImportDialog() {
    const dialogRef = this.dialog.open(ImportListDialogComponent, {
      width: '280px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateListWithFile(result);
    });
  }

  updateListWithFile(e) {
    const input = e.target;
    const file = input.files[0];
    this.importFileSelected.emit(file);
  }

  downloadCsv() {
    this.downloading = true;
    this.targetGeneListService.exportCsv(this.currentConsortium, this.currentFilters)
      .subscribe(data => {
        this.download('gene_list_' + this.currentConsortium + '.csv', data);
        this.downloading = false;
      }, error => {
        console.error(error);
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

}
