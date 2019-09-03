import { Component, OnInit } from '@angular/core';
import { PermissionsService } from 'src/app/core/services/permissions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public canRegisterUser: boolean;

  constructor(private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.permissionsService.evaluatePermission(PermissionsService.REGISTER_USER).subscribe(canRegisterUser => {
      this.canRegisterUser = canRegisterUser;
    })
  }

}
