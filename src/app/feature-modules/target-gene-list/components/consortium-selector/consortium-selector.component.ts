import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/core/model/user/user';
import { ManagedListsService, LoggedUserService, PermissionsService } from 'src/app/core';

@Component({
  selector: 'app-consortium-selector',
  templateUrl: './consortium-selector.component.html',
  styleUrls: ['./consortium-selector.component.css']
})
export class ConsortiumSelectorComponent implements OnInit {

  user: User = undefined;
  currentConsortium: string = undefined;
  consortia: NamedValue[] = [];
  canUpdateList = false;

  @Output() consortiumSelected = new EventEmitter<string>();
  @Output() updatePermissionSet = new EventEmitter<boolean>();

  constructor(
    private managedListsService: ManagedListsService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    this.loadPermissions();
  }

  onConsortiumChanged() {
    this.consortiumSelected.emit(this.currentConsortium);
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
      this.updatePermissionSet.emit(this.canUpdateList);
    });
  }

  private getRelatedConsortia(user: User): NamedValue[] {
    const consortiaNames = [];
    if (user && user.rolesConsortia) {
      user.rolesConsortia.map(x => {
        const element: NamedValue = { name: x.consortiumName };
        consortiaNames.push(element);
      });
    }
    return consortiaNames;
  }

}
