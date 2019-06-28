import { Component, OnInit, Input} from '@angular/core';
import { PlanHistory } from '../../model/plan-history';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-plan-history',
  templateUrl: './plan-history.component.html',
  styleUrls: ['./plan-history.component.css']
})
export class PlanHistoryComponent implements OnInit {
  @Input() planHistories: PlanHistory[];

  sortedData: PlanHistory[];

  constructor() { 
  }

  ngOnInit() {
    console.log('PlanHistoryComponent:', this.planHistories);
    this.sortedData = this.planHistories.slice();
    
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortData(sort: Sort) {
    const data = this.planHistories.slice();
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

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean ) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

