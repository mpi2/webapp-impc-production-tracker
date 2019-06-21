import { Component, OnInit } from '@angular/core';
import { PermissionsService } from 'src/app/core/services/permissions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private canRegisterUser: boolean;

  constructor(private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.permissionsService.evaluateAdminPermission(PermissionsService.REGISTER_USER).subscribe(canRegisterUser => {
      this.canRegisterUser = canRegisterUser;
    })
  }

}
