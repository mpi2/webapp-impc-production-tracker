import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Plan } from '../_models';
import { PlanService } from '../_services';


@Component({
    // selector: 'home',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

    plans: Plan[] = [];
    username: any;

    constructor(private planService: PlanService) {}

    ngOnInit() {
        this.planService.getAll().pipe(first()).subscribe(plans => {
            this.plans = plans;
        });

        this.username = JSON.parse(sessionStorage.getItem('tokenInfo')).username;
    }
}
