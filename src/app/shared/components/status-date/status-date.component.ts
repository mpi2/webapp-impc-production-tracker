import { Component, OnInit, Input } from '@angular/core';
import { StatusDate } from 'src/app/model';

@Component({
    selector: 'app-status-date',
    templateUrl: './status-date.component.html',
    styleUrls: ['./status-date.component.css'],
    standalone: false
})
export class StatusDateComponent implements OnInit {
  @Input() statusDates: StatusDate[];
  @Input() title: string;

  statusDatesColumns = ['status', 'date'];

  constructor() { }

  ngOnInit(): void {

  }

}
