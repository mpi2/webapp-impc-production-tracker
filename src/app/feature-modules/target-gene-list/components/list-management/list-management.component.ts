import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSidenav } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, share, startWith} from 'rxjs/operators';
import { FilterDefinition } from 'src/app/feature-modules/filters/model/filter-definition';
import { ListContentComponent } from '../list-content/list-content.component';

@Component({
  selector: 'app-list-management',
  templateUrl: './list-management.component.html',
  styleUrls: ['./list-management.component.css']
})
export class ListManagementComponent implements OnInit {

  updating = false;

  recordIdsToDelete = [];

  currentSelectedEditMode = false;
  newEditMode = 'edit';

  error;

  filterVisible = false;
  currentConsortium: string = undefined;
  canUpdateList: boolean;

  filters: FilterDefinition[];

  @ViewChild('drawer', { static: false }) drawer: MatSidenav;
  @ViewChild('listContent', { static: false }) listContent: ListContentComponent;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share(),
      startWith(false)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.setupFilters();
  }

  toogleShowFilters() {
    this.filterVisible = !this.filterVisible;
  }

  // Get the consortium selected in the consortium selector component.
  onConsortiumSelected(e) {
    this.currentConsortium = e;
    if (this.listContent) {
      this.listContent.getPage(0);
    }
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
        type: 'text',
        placeholder: 'Marker Symbol(s)'
      }
      ,
      {
        title: 'Work Units',
        name: 'workUnit',
        type: 'checkboxes',
        dataSource: [
          {
            name: 'WU1'
          },
          {
            name: 'WU2'
          }
        ]
      }
    ];
  }

  onImportFileSelected(e) {
    this.listContent.updateListWithFile(e);
  }

  onEditModeChanged(e) {
    this.currentSelectedEditMode = e;
  }

}
