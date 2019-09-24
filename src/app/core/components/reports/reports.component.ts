import { Component, OnInit } from '@angular/core';
import {ConfigAssetLoaderService} from '../../services/config-asset-loader.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  apiServiceUrl;

  constructor(private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.loadConfigurations().subscribe(data => this.apiServiceUrl = data.appServerUrl);
  }

  ngOnInit() {
  }

}
