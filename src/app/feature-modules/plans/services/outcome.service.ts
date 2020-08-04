import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigAssetLoaderService } from '../../../core/services/config-asset-loader.service';
import { Outcome } from '../model/outcomes/outcome';

@Injectable({
    providedIn: 'root'
})
export class OutcomeService {

    private apiServiceUrl;

    constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
        this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
    }

    /**
     * Get all the outcomes for a plan identified by 'pin'.
     * @param pin Identifier of the plan.
     */
    getOutcomesByPin(pin: string) {
        return this.http.get<Outcome[]>(this.apiServiceUrl + '/api/plans/' + pin + '/outcomes');
    }

    updateOutcome(pin: string, outcome: Outcome) {
        return this.http.put<any>(this.apiServiceUrl + '/api/plans/' + pin + '/outcomes/' + outcome.tpo, outcome);
    }
}
