import { Component, OnInit } from '@angular/core';
import { ChangesHistory, ChangesHistoryAdapter } from 'src/app/core/model/history/changes-history';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from 'src/app/feature-modules/plans';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  historyRecords: ChangesHistory[] = [];
  sortedData: ChangesHistory[] = [];

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private adapter: ChangesHistoryAdapter) { }

  ngOnInit() {
    let pid = this.route.snapshot.params['pid'];
    if (pid) {
      this.planService.getHistoryByPid(pid).subscribe(data => {
        this.historyRecords = data;
        this.historyRecords = this.historyRecords.map(x => this.adapter.adapt(x));
        this.sortedData = this.historyRecords.slice();
        console.log('history', this.sortedData );
        
      });
    }
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortData(sort: Sort) {
    const data = this.historyRecords.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case '#': return compare(a.id, b.id, isAsc);
        case 'user': return compare(a.user, b.user, isAsc);
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
