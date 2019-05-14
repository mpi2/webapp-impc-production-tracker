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
        this.getPage(1);
    }

    getPage(page: number)
    {
        this.loading = true;
        // The end point starts page in number 0, while the component starts with 1.
        let apiPageNumber = page -1;
        this.planService.getAllPlanSummariesWithPage(apiPageNumber).pipe(first()).subscribe(data => {
            console.log('Raw data from service::', data);
            this.plans = data['_embedded']['planSummaryDToes'];
            this.page = data['page'];
            this.p = page;
            console.log('Plans::', this.plans);
            console.log('page::', this.page);
        });
    }
}
