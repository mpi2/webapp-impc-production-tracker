import { Component } from '@angular/core';
import 'chartjs-adapter-moment';
import { HttpClient } from "@angular/common/http";
import { ConfigAssetLoaderService } from "../../services/config-asset-loader.service";
import { map, shareReplay, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    standalone: false
})
export class ReportsComponent {
  apiServiceUrl: string;
  public workUnits$: Observable<Array<string>>;
  public networks$: Observable<Array<string>>;
  public attemptWorkUnitSelected: string;
  public attemptTypeSelected: string;
  public rridReportType: string;
  public rridAutocompleteFormControl = new FormControl('', { validators: [Validators.required] });
  constructor(
    public httpClient: HttpClient,
    private configAssetLoaderService: ConfigAssetLoaderService
  ) {
    this.configAssetLoaderService.getConfig().then(data => {
      this.apiServiceUrl = data.appServerUrl;
      this.fetchConfig();
      this.networks$ = httpClient.get(`${this.apiServiceUrl}/api/distributionNetwork/findAllNames`) as Observable<Array<string>>
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

  downloadRRIDReport() {
    const link =  document.createElement('a');
    link.href = `${this.apiServiceUrl}/api/reports/distribution?networkname=${this.rridAutocompleteFormControl.value}&reporttype=${this.rridReportType}`;
    link.click();
  }
  downloadCrisprAllelesReport() {
    const link =  document.createElement('a');
    link.href = `${this.apiServiceUrl}/api/reports/mutation/genome_browser_combined?workUnit=${this.attemptWorkUnitSelected}`;
    link.click();
  }
}
