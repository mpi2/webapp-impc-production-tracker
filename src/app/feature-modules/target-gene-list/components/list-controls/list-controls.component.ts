import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSlideToggleChange } from '@angular/material';
import { ImportListDialogComponent } from '../import-list-dialog/import-list-dialog.component';
import { TargetGeneListService } from '../../services/target-gene-list.service';

@Component({
  selector: 'app-list-controls',
  templateUrl: './list-controls.component.html',
  styleUrls: ['./list-controls.component.css']
})
export class ListControlsComponent implements OnInit {
  @Input() canUpdateList;
  @Input() currentConsortium;

  @Output() importFileSelected = new EventEmitter<any>();
  @Output() editModeChanged = new EventEmitter<boolean>();

  currentSelectedEditMode = false;
  newEditMode = 'edit';

  constructor(private targetGeneListService: TargetGeneListService, public dialog: MatDialog) { }

  ngOnInit() {
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
    console.log('children', e);

    this.importFileSelected.emit(file);
    // this.targetGeneListService.updateListWithFile(this.currentConsortium, file).subscribe(data => {
    //   this.extractDataFromServerResponse(data);
    // }, error => {
    //   console.error('error', error);

    // });

  }

  downloadCsv(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

}
