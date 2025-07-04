import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Colony } from '../../../model/outcomes/colony';
import { DistributionProduct } from '../../../model/outcomes/distribution-product';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
    selector: 'app-distribution-product-list',
    templateUrl: './distribution-product-list.component.html',
    styleUrls: ['./distribution-product-list.component.css'],
    standalone: false
})
export class DistributionProductListComponent implements OnInit, OnChanges {
  @Input() colony: Colony;
  @Input() canUpdate: boolean;

  dataSource: DistributionProduct[];

  configurationData: ConfigurationData;
  distributionCentresNames: NamedValue[] = [];
  productTypesNames: NamedValue[] = [];
  distributionNetworksNames: NamedValue[] = [];

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  constructor(private configurationDataService: ConfigurationDataService, public dialog: MatDialog) { }

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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.colony) {
      this.colony = changes.colony.currentValue;
      this.setInitialData();
    }
  }

  addDistributionProduct() {
    const distributionProduct: DistributionProduct = new DistributionProduct();
    distributionProduct[this.tmpIndexRowName] = this.nextNewId--;
    this.colony.distributionProducts.push(distributionProduct);
    this.dataSource = [...this.colony.distributionProducts];
  }


  onClickToDeleteDistributionProduct(distributionProduct: DistributionProduct) {
    if (this.isNewRecord(distributionProduct)) {
      this.deleteDistributionProduct(distributionProduct);
    } else {
      this.showDeleteMutationConfirmationDialog(distributionProduct);
    }
  }

  showDeleteMutationConfirmationDialog(distributionProduct: DistributionProduct) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { confirmed: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDistributionProduct(distributionProduct);
      }
    });
  }

  deleteDistributionProduct(distributionProduct: DistributionProduct) {
    if (this.isNewRecord(distributionProduct)) {
      this.colony.distributionProducts = this.colony.distributionProducts
        .filter(x => x[this.tmpIndexRowName] !== distributionProduct[this.tmpIndexRowName]);
    } else {
      this.colony.distributionProducts = this.colony.distributionProducts
        .filter(x => x.id !== distributionProduct.id);
    }
    this.dataSource = [...this.colony.distributionProducts];

  }

  private isNewRecord(distributionProduct: DistributionProduct) {
    return distributionProduct.id === null;
  }

}
