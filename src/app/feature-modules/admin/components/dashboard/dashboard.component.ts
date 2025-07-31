import { Component, OnInit } from '@angular/core';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { LoggedUserService } from 'src/app/core';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit {

  public canRegisterUser: boolean;

  constructor(private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    this.canExecuteManagerTasks().subscribe(data => this.canRegisterUser = data);
  }

  canExecuteManagerTasks() {
    return this.loggedUserService.getLoggerUser().pipe(
        map(data => PermissionsService.canExecuteManagerTasks(data))
    );
}

}
