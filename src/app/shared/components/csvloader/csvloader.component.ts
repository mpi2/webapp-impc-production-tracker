import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-csvloader',
  templateUrl: './csvloader.component.html',
  styleUrls: ['./csvloader.component.css']
})
export class CSVLoaderComponent implements OnInit {

  records: any[] = [];
  @Output() dataChange = new EventEmitter();

  constructor(private papa: Papa) { }

  ngOnInit() {
  }

  uploadListener($event: any): void {
    const input = $event.target;
    this.papa.parse(input.files[0], {
      complete: (result) => {
        if (result.errors.length > 0) {
          console.error('Error importing file:', result.errors);
        }
        this.records = result.data;
        this.dataChange.emit(this.records);
      }
    });
  }

}
