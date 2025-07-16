import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/core/model/user/user';
import { ManagedListsService, LoggedUserService, PermissionsService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
    selector: 'app-consortium-selector',
    templateUrl: './consortium-selector.component.html',
    styleUrls: ['./consortium-selector.component.css'],
    standalone: false
})
export class ConsortiumSelectorComponent implements OnInit {

  @Output() updatePermissionSet = new EventEmitter<boolean>();

  user: User = undefined;
  currentConsortium: string = undefined;
  consortia: NamedValue[] = [];
  canUpdateList = false;

  constructor(
    private managedListsService: ManagedListsService,
    private messageService: MessageService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    this.loadPermissions();
  }

  onConsortiumChanged() {
    this.messageService.setMessage({geneListSelectedConsortium: this.currentConsortium});

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
