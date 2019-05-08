import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Plan } from '../_models';
import { PlanService } from '../_services';
import { PlanSummary } from '../_models/project/planSummary';


@Component({
    // selector: 'home',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

    plans: PlanSummary[] = [];
    username: any;

    constructor(private planService: PlanService) {}

    ngOnInit() {
        this.planService.getAllPlanSummaries().pipe(first()).subscribe(plans => {
            console.log('what plans???? ');
            console.log(plans);
            
            
            this.plans = plans;
            console.log('THIS ');
            console.log(this.plans );
        });

        // this.username = JSON.parse(sessionStorage.getItem('tokenInfo')).username;
    }
}
