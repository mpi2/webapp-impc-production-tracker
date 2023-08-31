import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { forkJoin, from, fromEvent, merge, Observable } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  switchMap, tap,
} from "rxjs/operators";
import * as moment from "moment/moment";
import { Moment } from "moment/moment";
import { MatDatepicker, MatDatepickerInputEvent } from "@angular/material/datepicker";
import { ChartConfiguration } from "chart.js";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { BaseChartDirective } from "ng2-charts";
import { ConfigAssetLoaderService } from "../../../services/config-asset-loader.service";
import { HttpClient } from "@angular/common/http";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { FormControl } from "@angular/forms";

type EndpointData = {
  year: number,
  month: number,
  sum: number,
};

type ChartData = Array<{x: Date, y: number}>;

const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-production-numbers-tab',
  templateUrl: './production-numbers-tab.component.html',
  styleUrls: ['./production-numbers-tab.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ProductionNumbersTabComponent implements OnInit, AfterViewInit {
  apiServiceUrl: string;
  public chartData;
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    scales: {
      y: {
        stacked: true
      } ,
      x: {
        type: 'time',
        time: { unit: 'month', tooltipFormat: 'MMM yyyy', round: 'month' },
        min: "2006-11-01T00:00:00Z",
      }
    },
    plugins: {
      title: { display: false },
      legend: { display: false }
    }
  }
  public totalNumOfGenes$: Observable<number>;
  public workGroups$: Observable<Array<string>>;
  public workUnits$: Observable<Array<string>>;
  public workGroupControl = new FormControl('');
  public workUnitControl = new FormControl('');
  public selectedWorkGroup: string;
  public selectedWorkUnit: string;
  public isFetchingData: boolean;
  public charDataIsAvailable = true;
  public selectedStartDate: Date;
  public selectedEndDate: Date;
  private activeFilters: { [filterKey: string]: boolean } = {};
  @ViewChild('workGroupInput') workGroupInput: ElementRef<HTMLInputElement>;
  @ViewChild('workGroupAutocomplete') workGroupAutocomplete: MatAutocomplete;
  @ViewChild('workUnitInput') workUnitInput: ElementRef<HTMLInputElement>;
  @ViewChild('workUnitAutocomplete') workUnitAutocomplete: MatAutocomplete;
  @ViewChild(BaseChartDirective) public chartDirective: BaseChartDirective;

  constructor(
    private configAssetLoaderService: ConfigAssetLoaderService,
    private httpClient: HttpClient
  ) {
    this.configAssetLoaderService.getConfig().then(data => {
      this.apiServiceUrl = data.appServerUrl;
      this.fetchDataForCharts();
    });
  }

  ngOnInit() {
    this.fetchTotalNumOfGenes();
    this.fetchConfig();
    this.workGroupControl.disable();
  }

  ngAfterViewInit() {
    this.setUpInputs();
  }

  fetchDataForCharts() {
    const endpointESCELL = this.generateURL(`${this.apiServiceUrl}/api/glt_production_numbers?reporttype=month&attempt=escell`);
    const endpointCRISPR = this.generateURL(`${this.apiServiceUrl}/api/glt_production_numbers?reporttype=month&attempt=crispr`);
    this.isFetchingData = true;
    this.charDataIsAvailable = true;
    forkJoin([
      this.httpClient.get<Array<EndpointData>>(endpointESCELL),
      this.httpClient.get<Array<EndpointData>>(endpointCRISPR),
    ])
      .subscribe(data => {
        this.isFetchingData = false;
        if (data[0].length === 0 && data[1].length === 0) {
          this.charDataIsAvailable = false;
        } else {
          this.charDataIsAvailable = true;
          const crisprData = this.transformData(data[1]);
          const escellData = this.transformData(data[0]);
          const latestDateCRISPR = crisprData[crisprData.length - 1]?.x;
          const latestDateEsCell = escellData[escellData.length - 1]?.x;
          const latestDateOverall = latestDateCRISPR > latestDateEsCell ? latestDateCRISPR : latestDateEsCell;
          const earliestEsCellDate = new Date(escellData[0].x);
          earliestEsCellDate.setMonth(earliestEsCellDate.getMonth() - 2);
          this.lineChartOptions.scales.x.min = earliestEsCellDate.toISOString();
          this.chartData = {
            labels: ['ES Cell', 'CRISPR'],
            datasets: [
              {
                label: 'ES Cell',
                data: this.fillMissingData(escellData, latestDateOverall),
                fill: true,
              },
              {
                label: 'CRISPR',
                data: this.fillMissingData(crisprData, latestDateOverall),
                fill: true,
              }
            ]
          }
        }
      });
  }

  fetchTotalNumOfGenes() {
    const endpointURL = `${this.apiServiceUrl}/api/glt_production_numbers/overlap/union`;
    this.totalNumOfGenes$ = this.httpClient.get(endpointURL).pipe(map((data: Array<number>) => data[0]));
  }

  fetchConfig() {
    const endpointURL = `${this.apiServiceUrl}/api/conf`;
    const configObservable = this.httpClient.get(endpointURL).pipe(shareReplay(1));
    this.workGroups$ = configObservable.pipe(
      map((data: any) => data.workGroupsByWorkUnits),
      map(workGroups => new Map(Object.keys(workGroups).map(key => [key, workGroups[key]]))),
      switchMap((workGroupMap) =>
        this.workUnitControl.valueChanges.pipe(
          startWith(""),
          map(inputValue => workGroupMap.get(inputValue))
      ))
    );
    this.workUnits$ = configObservable.pipe(
      map((data: any) => data.workUnits.sort()),
    );
  }

  setUpInputs() {
    merge(
      fromEvent<InputEvent>(this.workGroupInput.nativeElement, 'change'),
      fromEvent<InputEvent>(this.workGroupInput.nativeElement, 'keyup'),
      from(this.workGroupAutocomplete.optionSelected),
    )
      .pipe(
        map((event: any) => event.target ? event.target.value : event.option.value),
        distinctUntilChanged(),
        debounceTime(300),
      )
      .subscribe(selectedWorkGroup => {
        this.selectedWorkGroup = selectedWorkGroup;
        this.fetchDataForCharts();
      });

    merge(
      fromEvent<InputEvent>(this.workUnitInput.nativeElement, 'change'),
      fromEvent<InputEvent>(this.workUnitInput.nativeElement, 'keyup'),
      from(this.workUnitAutocomplete.optionSelected),
    )
      .pipe(
        map((event: any) => event.target ? event.target.value : event.option.value),
        tap(value => !!value ? this.workGroupControl.enable() : this.workGroupControl.disable()),
        distinctUntilChanged(),
        debounceTime(300),
      )
      .subscribe(selectedWorkUnit => {
        this.selectedWorkUnit = selectedWorkUnit;
        this.fetchDataForCharts();
      });
  }

  downloadChart() {
    const imageData = this.chartDirective.chart.toBase64Image();
    const link =  document.createElement('a');
    const formatDate = date => moment(date).format('MMM-YYYY');
    link.download = 'report-chart';
    if (this.selectedWorkUnit) {
      link.download += `-${this.selectedWorkUnit}`;
    }
    if (this.selectedWorkGroup) {
      link.download += `-${this.selectedWorkGroup}`;
    }
    if (this.selectedStartDate && !this.selectedEndDate) {
      link.download += `-from-${formatDate(this.selectedStartDate)}`;
    } else if (!this.selectedStartDate && this.selectedEndDate) {
      link.download += `-to-${formatDate(this.selectedEndDate)}`;
    } else {
      link.download += `-from-${formatDate(this.selectedStartDate)}-to-${formatDate(this.selectedEndDate)}`;
    }
    link.download += '.png'
    link.href = imageData;
    link.click();
  }

  downloadFile(type: string) {
    let endpointURL: string;
    if (type === 'ES Cell') {
      endpointURL = this.generateURL(`${this.apiServiceUrl}/api/reports/glt_production_numbers?reporttype=month&attempt=escell`);
    } else {
      endpointURL = this.generateURL(`${this.apiServiceUrl}/api/reports/glt_production_numbers?reporttype=month&attempt=crispr`);
    }
    const link =  document.createElement('a');
    link.href = endpointURL;
    link.click();
  }

  onSelectedMonth(field: string, date: Moment, datepicker: MatDatepicker<Moment>) {
    this[field] = date.toDate();
    datepicker.close();
    this.fetchDataForCharts();
  }

  onChangedDate(field: string, event: MatDatepickerInputEvent<Moment>) {
    this[field] = !!event.value ? event.value.toDate() : null;
    this.fetchDataForCharts();
  }

  onLegendItemClick(event: Event, legend) {
    const filterKey = legend.text.replace(/ /g, '_');
    this.activeFilters[filterKey] = !this.activeFilters[filterKey];
    this.toggleDatasetVisibility(filterKey);
  }
  isItemFilterActive(item): boolean {
    const filterKey = item.text.replace(/ /g, '_');
    return this.activeFilters[filterKey];
  }
  private transformData(data: Array<EndpointData>) {
    return data
      .map(d => ({
        y: d.sum,
        x: new Date(d.year, d.month - 1),
      }))
      .sort((p1, p2) => p1.x.getTime() - p2.x.getTime());
  }
  private fillMissingData(data: ChartData, latestDateOverall: Date): ChartData {
    if (data.length === 0) {
      return data;
    }
    const isNextMonth = (d1: Date, d2: Date) =>
      d1.getMonth() + 1 === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    const isNextYear = (d1: Date, d2: Date) =>
      d1.getMonth() === 11 && d2.getMonth() === 0 && d1.getFullYear() + 1 === d2.getFullYear();
    const generateNewPoint = (data: number, date: Date) => {
      const dataToAdd = {
        y: data,
        x: new Date(date.getFullYear(), date.getMonth() + 1)
      };
      // special case
      if (date.getMonth() === 11) {
        dataToAdd.x = new Date(date.getFullYear() + 1, 0);
      }
      return dataToAdd;
    }

    const tempData = [...data];

    let lastDataDate = tempData[tempData.length - 1]?.x;

    if (latestDateOverall > lastDataDate) {
      lastDataDate = latestDateOverall;
    }
    let i = 0;
    while(tempData[i].x < lastDataDate) {
      const { x: firstPointDate, y: firstPointData } = tempData[i];
      const secondPointDate = !!tempData[i+1] ? tempData[i+1].x : lastDataDate;
      const secondPointValue = !!tempData[i+1] ? tempData[i+1].y : null;
      const isTheNextPoint = isNextMonth(firstPointDate, secondPointDate) || isNextYear(firstPointDate, secondPointDate);
      const hasAValue = !!secondPointValue;
      if (isTheNextPoint && hasAValue) {
        //
      } else {
        const dataToAdd = generateNewPoint(firstPointData, firstPointDate);
        tempData.splice(i + 1, 0, dataToAdd);
      }
      i+=1;
    }
    return tempData;
  }

  private toggleDatasetVisibility(filterKey: string) {
    const dataSetIndex = filterKey === 'ES_Cell' ? 0 : 1;
    if (this.activeFilters[filterKey]) {
      this.chartDirective.chart.hide(dataSetIndex);
    } else {
      this.chartDirective.chart.show(dataSetIndex);
    }
  }

  private generateURL(endpointURL: string) {
    if (this.selectedWorkGroup) {
      endpointURL += `&workGroup=${this.selectedWorkGroup}`;
    }
    if (this.selectedWorkUnit) {
      endpointURL += `&workunit=${this.selectedWorkUnit}`;
    }
    if (this.selectedStartDate) {
      endpointURL += `&startyear=${this.selectedStartDate.getFullYear()}&startmonth=${this.selectedStartDate.getMonth() + 1}`;
    }
    if (this.selectedEndDate) {
      endpointURL += `&endyear=${this.selectedEndDate.getFullYear()}&endmonth=${this.selectedEndDate.getMonth() + 1}`;
    }
    return endpointURL;
  }
}
