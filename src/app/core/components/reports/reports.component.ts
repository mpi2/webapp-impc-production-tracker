import { Component } from '@angular/core';
import 'chartjs-adapter-moment';
import { HttpClient } from "@angular/common/http";
import { ConfigAssetLoaderService } from "../../services/config-asset-loader.service";
import { map, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  apiServiceUrl: string;
  public workUnits$: Observable<Array<string>>;
  public attemptWorkUnitSelected: string;
  public attemptTypeSelected: string;
  constructor(
    public httpClient: HttpClient,
    private configAssetLoaderService: ConfigAssetLoaderService
  ) {
    this.configAssetLoaderService.getConfig().then(data => {
      this.apiServiceUrl = data.appServerUrl;
      this.fetchConfig();
    });
  }

  fetchConfig() {
    const endpointURL = `${this.apiServiceUrl}/api/conf`;
    const configObservable = this.httpClient.get(endpointURL).pipe(shareReplay(1));
    this.workUnits$ = configObservable.pipe(map((data: any) => data.workUnits.sort()));
  }

  onOptionActivated(event) {
    this.attemptWorkUnitSelected = event.target ? event.target.value : event.option.value;
  }

  downloadWorkUnitAttemptsReport() {
    const link =  document.createElement('a');
    link.href = `${this.apiServiceUrl}/api/reports/workunit_attempts?workunit=${this.attemptWorkUnitSelected}&attempt=${this.attemptTypeSelected}`;
    link.click();
  }
}
