import { Component, OnInit } from '@angular/core';
import { ConfigAssetLoaderService } from '../../services/config-asset-loader.service';
import { HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";
import { ChartConfiguration } from "chart.js";
import 'chartjs-adapter-moment';

type EndpointData = {
  year: number,
  month: number,
  sum: number,
};

type ChartData = Array<{x: Date, y: number}>;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  apiServiceUrl;
  public chartData;
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    scales: {
      y: {
        stacked: true
      } ,
      x: {
        type: 'time',
        time: { unit: 'month', tooltipFormat: 'MMM yyyy', round: 'month' },
        min: "2006-01-01 00:00:00",
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Genes studied by both ES Cell and CRISPR based techniques'
      }
    }
  }
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
  }

  fetchDataForCharts() {
    const endpointESCELL = `${this.apiServiceUrl}/api/glt_production_numbers?reporttype=month&attempt=escell`;
    const endpointCRISPR = `${this.apiServiceUrl}/api/glt_production_numbers?reporttype=month&attempt=crispr`;
    forkJoin([
      this.httpClient.get<Array<EndpointData>>(endpointESCELL),
      this.httpClient.get<Array<EndpointData>>(endpointCRISPR),
    ])
      .subscribe(data => {
        const crisprData = this.transformData(data[1]);
        const escellData = this.fillMissingData(this.transformData(data[0]), crisprData);
        this.chartData = {
          labels: ['ES Cell', 'CRISPR'],
          datasets: [
            {
              label: 'ES Cell',
              data: escellData,
              fill: true,
            },
            {
              label: 'CRISPR',
              data: crisprData,
              fill: true,
            }
          ]
        }
      });
  }

  private transformData(data: Array<EndpointData>) {
    return data
      .map(d => ({ y: d.sum, x: new Date(`${d.year}-${d.month}`) }))
      .sort((p1, p2) => p1.x.getTime() - p2.x.getTime());
  }
  private fillMissingData(data: ChartData, otherDataset: ChartData): ChartData {
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
      return dataToAdd
    }

    const tempData = [...data];

    let lastDataDate = tempData[tempData.length - 1].x;

    if (otherDataset[otherDataset.length - 1].x > lastDataDate) {
      lastDataDate = otherDataset[otherDataset.length - 1].x
    }
    let i = 0;
    while(tempData[i].x < lastDataDate) {
      const { x: firstPointDate, y: firstPointData } = tempData[i];
      const secondPointDate = !!tempData[i+1] ? tempData[i+1].x : lastDataDate;
      const secondPointValue = !!tempData[i+1] ? tempData[i+1].y : null;
      const isTheNextPoint = isNextMonth(firstPointDate, secondPointDate) || isNextYear(firstPointDate, secondPointDate);
      const hasAValue = !!secondPointValue;
      if (isTheNextPoint && hasAValue) {
        // do nothing
      } else {
        const dataToAdd = generateNewPoint(firstPointData, firstPointDate);
        tempData.splice(i + 1, 0, dataToAdd);
      }
      i+=1;
    }
    return tempData;
  }
}
