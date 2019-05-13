import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { PlanService } from '../_services';
import { PlanSummary } from '../_models/project/planSummary';


@Component({
    // selector: 'home',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

    plans: PlanSummary[] = [];
    username: any;
    p: number = 1;
    page: any = {};
    loading = false;

    constructor(private planService: PlanService) {}

    ngOnInit() {
        this.planService.getAllPlanSummariesWithPage(1).pipe(first()).subscribe(plans => {
            this.getPage(1);
        });

        // this.username = JSON.parse(sessionStorage.getItem('tokenInfo')).username;
    }

    getPage(page: number)
    {
        this.loading = true;
        this.planService.getAllPlanSummariesWithPage(page).pipe(first()).subscribe(plans => {
            this.plans = plans['_embedded']['planSummaryDToes'];
            this.page = plans['page'];
            this.p = page;
        });
    }
}
