import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, share, startWith } from 'rxjs/operators';
import { FilterDefinition } from 'src/app/feature-modules/filters/model/filter-definition';
import { ListContentComponent } from '../list-content/list-content.component';
import { FilterType } from 'src/app/feature-modules/filters/model/filter-type';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
    selector: 'app-list-management',
    templateUrl: './list-management.component.html',
    styleUrls: ['./list-management.component.css'],
    standalone: false
})
export class ListManagementComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') drawer: MatSidenav;
  @ViewChild('listContent') listContent: ListContentComponent;

  updating = false;
  recordIdsToDelete = [];
  currentSelectedEditMode = false;
  newEditMode = 'edit';
  error;
  filterVisible = false;
  currentConsortium: string = undefined;
  canUpdateList: boolean;
  messageSubscription;
  filters: FilterDefinition[];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share(),
      startWith(false)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private messageService: MessageService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.setupFilters();
    this.subscribeToChangeInConsortium();
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }

  subscribeToChangeInConsortium() {
    this.messageSubscription = this.messageService.getMessage().subscribe(data => {
      this.currentConsortium = data.message.geneListSelectedConsortium;
    });
  }

  toogleShowFilters() {
    this.filterVisible = !this.filterVisible;
  }

  // Get the update permission in the consortium selector component.
  onUpdatePermissionSet(e) {
    this.canUpdateList = e;
  }

  setupFilters() {
    this.filters = [
      {
        title: 'Gene',
        name: 'markerSymbol',
        label: null,
        expanded: true,
        type: FilterType.text,
        placeholder: 'Marker Symbol(s)'
      }

    ];
  }

  onImportFileSelected(e) {
    this.listContent.updateListWithFile(e);
  }

  onExportOptionSelected(e) {
    this.listContent.downloadCsv();

  }

  onEditModeChanged(e) {
    this.currentSelectedEditMode = e;
  }

  onErrorInContent(e) {
    this.error = e;
  }

}
