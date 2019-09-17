import { Component, OnInit } from '@angular/core';
import { ChangesHistory, ChangesHistoryAdapter } from 'src/app/core/model/history/changes-history';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from 'src/app/feature-modules/plans';
import { ProjectService } from 'src/app/feature-modules/projects';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  historyRecords: ChangesHistory[] = [];
  sortedData: ChangesHistory[] = [];
  private entity: string;
  private id: string;
  error: string;

  private readonly LENGTH_LIMIT = 100;
  private isContentLengthGreaterThanLimit: boolean;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private projectService: ProjectService,
    private adapter: ChangesHistoryAdapter) { }

  ngOnInit() {
    this.getData()
  }

  private getData() {
    this.route.data.subscribe(
      v => {
        this.entity = v.entity;
        this.id = this.route.snapshot.params[v.id];
        this.getHistory()
      });
  }

  private getHistory() {
    switch (this.entity) {
      case 'project':
        this.getProjectHistory(this.id);
        break;
      case 'plan':
        this.getPlanHistory(this.id);
        break;
    }
  }

  private getProjectHistory(tpn: string) {
    this.projectService.getHistoryByTpn(tpn).subscribe(data => {
      this.historyRecords = data;
      this.adaptData();
    }, error => {
      this.error = error;
    });
  }

  private getPlanHistory(pid: string) {
    this.planService.getHistoryByPid(pid).subscribe(data => {
      this.historyRecords = data;
      this.adaptData();
    }, error => {
      this.error = error;
    });
  }

  private adaptData() {
    this.historyRecords = this.historyRecords.map(x => this.adapter.adapt(x));
    this.sortedData = this.historyRecords.slice();
  }

  isTextLargerThanLimit(text: string) {  
    return text === null ? false : (text.length > this.LENGTH_LIMIT);
  }

  getTitleForExpandable(): string
  {    
    return 'Click to see element';
  }
}