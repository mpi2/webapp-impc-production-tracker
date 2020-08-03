import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Colony } from '../../../model/outcomes/colony';
import { DistributionProduct } from '../../../model/outcomes/distribution-product';
import { ConfigurationData, ConfigurationDataService, WorkUnit } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-distribution-product-list',
  templateUrl: './distribution-product-list.component.html',
  styleUrls: ['./distribution-product-list.component.css']
})
export class DistributionProductListComponent implements OnInit , OnChanges {
  @Input() colony: Colony;
  @Input() canUpdate: boolean;

  editionStatusByDistributionProduct = new Map<number, string>();

  dataSource: DistributionProduct[];
  originalData: DistributionProduct[];

  configurationData: ConfigurationData;
  distributionCentresNames: NamedValue[] = [];
  productTypesNames: NamedValue[] = [];
  distributionNetworksNames: NamedValue[] = [];
  nextNewId = 0;

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
    this.setEmptyEditionStatuses();
    this.setOriginalDonors();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.crisprAttempt) {
      this.colony = changes.colony.currentValue;
      this.setInitialData();
    }
  }

  setEmptyEditionStatuses(): void {
    this.colony.distributionProducts.map(x => this.editionStatusByDistributionProduct.set(x.id, ''));
  }

  setOriginalDonors(): void {
    this.originalData = JSON.parse(JSON.stringify(this.colony.distributionProducts));
  }

  onDistributionProductChanged(distributionProduct: DistributionProduct) {
    console.log('distributionProduct', distributionProduct);
    this.updateRowStatus(distributionProduct);
  }

  addDistributionProduct() {
    const distributionProduct: DistributionProduct = new DistributionProduct();
    distributionProduct.id = this.nextNewId--;

    this.colony.distributionProducts.push(distributionProduct);
    this.editionStatusByDistributionProduct.set(distributionProduct.id, 'Created in memory');
    this.dataSource = [...this.colony.distributionProducts];
  }

  getEditionStatusForDistributionProduct(id: number): string {
    return this.editionStatusByDistributionProduct.get(id);
  }

  onClickToDeleteDistributionProduct(distributionProduct: DistributionProduct) {

  }

  updateRowStatus(distributionProduct: DistributionProduct): void {
    const originalDistributionProduct = this.originalData.find(x => x.id === distributionProduct.id);
    if (originalDistributionProduct) {
      if (JSON.stringify(originalDistributionProduct) !== JSON.stringify(distributionProduct)) {
        this.editionStatusByDistributionProduct.set(distributionProduct.id, 'Modified in memory');
      } else {
        this.editionStatusByDistributionProduct.set(distributionProduct.id, '');
      }
    }
  }

  onStartDateChanged(distributionProduct: DistributionProduct, event: MatDatepickerInputEvent<Date>) {

    distributionProduct.startDate = event.value;
    console.log(distributionProduct);
    console.log(event);
    this.onDistributionProductChanged(distributionProduct);
  }

}
