import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FilterService } from 'src/app/feature-modules/filters/services/filter.service';
import { ImportListDialogComponent } from '../import-list-dialog/import-list-dialog.component';

@Component({
    selector: 'app-list-controls',
    templateUrl: './list-controls.component.html',
    styleUrls: ['./list-controls.component.css'],
    standalone: false
})
export class ListControlsComponent implements OnInit, OnDestroy {
  @Input() canUpdateList;
  @Input() currentConsortium;

  @Output() importFileSelected = new EventEmitter<any>();
  @Output() exportOptionSelected = new EventEmitter<any>();
  @Output() editModeChanged = new EventEmitter<boolean>();

  downloading;

  currentSelectedEditMode = false;
  newEditMode = 'edit';
  currentFilters: any = {};
  filterChangesSubscription;
  messageSubscription;

  constructor(
    public dialog: MatDialog,
    private filterService: FilterService) { }

  ngOnInit() {
    this.subscribeToFilterChanges();
  }

  ngOnDestroy() {
    this.filterChangesSubscription.unsubscribe();
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

  emitDownloadCsvEvent() {
    this.exportOptionSelected.emit();
  }


  private subscribeToFilterChanges() {
    this.filterChangesSubscription =
      this.filterService.filterChange.subscribe(filters => {
        this.currentFilters = filters;
      });
  }

}
