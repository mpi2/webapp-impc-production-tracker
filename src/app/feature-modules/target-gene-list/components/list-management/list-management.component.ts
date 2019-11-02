import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-management',
  templateUrl: './list-management.component.html',
  styleUrls: ['./list-management.component.css']
})
export class ListManagementComponent implements OnInit {

  public records: any[] = [];

  constructor() {}

  ngOnInit() {
  }

  changeLists(e) {
    console.log('changed the data!!! ');
  }

}
