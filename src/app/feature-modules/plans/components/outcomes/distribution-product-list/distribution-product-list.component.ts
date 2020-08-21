import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Colony } from '../../../model/outcomes/colony';
import { DistributionProduct } from '../../../model/outcomes/distribution-product';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';

@Component({
  selector: 'app-distribution-product-list',
  templateUrl: './distribution-product-list.component.html',
  styleUrls: ['./distribution-product-list.component.css']
})
export class DistributionProductListComponent implements OnInit, OnChanges {
  @Input() colony: Colony;
  @Input() canUpdate: boolean;

  dataSource: DistributionProduct[];
  originalData: DistributionProduct[];

  configurationData: ConfigurationData;
  distributionCentresNames: NamedValue[] = [];
  productTypesNames: NamedValue[] = [];
  distributionNetworksNames: NamedValue[] = [];

  constructor(private configurationDataService: ConfigurationDataService) { }

  ngOnInit(): void {
    this.setInitialData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.distributionCentresNames = this.configurationData.workUnits.map(x => ({ name: x }));
      this.productTypesNames = this.configurationData.productTypes.map(x => ({ name: x }));
      this.distributionNetworksNames = this.configurationData.distributionNetworks.map(x => ({ name: x }));
    });
  }

  setInitialData(): void {
    this.loadConfigurationData();
    this.dataSource = this.colony.distributionProducts;
    this.setOriginalDonors();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.colony) {
      this.colony = changes.colony.currentValue;
      this.setInitialData();
    }
  }


  setOriginalDonors(): void {
    this.originalData = JSON.parse(JSON.stringify(this.colony.distributionProducts));
  }

  addDistributionProduct() {
    const distributionProduct: DistributionProduct = new DistributionProduct();
    this.colony.distributionProducts.push(distributionProduct);
    this.dataSource = [...this.colony.distributionProducts];
  }


  onClickToDeleteDistributionProduct(distributionProduct: DistributionProduct) {
  }

}
