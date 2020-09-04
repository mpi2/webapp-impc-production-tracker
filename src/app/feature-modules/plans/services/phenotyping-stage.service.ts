import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigAssetLoaderService } from '../../../core/services/config-asset-loader.service';
import { PhenotypingStage } from '../../attempts/model/phenotyping/phenotyping-stage';

@Injectable({
    providedIn: 'root'
})
export class PhenotypingStageService {

    private apiServiceUrl;

    constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
        this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
    }

    /**
     * Gets a phenotyping stage by its url
     * @param url Url to get the phenotyping stage.
     */
    getPhenotypingStageByUrl(url: string) {
        return this.http.get<PhenotypingStage>(url);
    }

    /**
     * Gets a phenotyping stage by its url
     * @param url Url to get the phenotyping stage.
     */
    getPhenotypingStageByPinAndPsn(pin: string, psn: string) {
        return this.http.get<PhenotypingStage>(this.apiServiceUrl + '/api/plans/' + pin + '/phenotypingStages/' + psn);
    }
}
