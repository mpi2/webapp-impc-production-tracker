import { Component, OnInit, Input } from '@angular/core';
import { Colony } from '../../../model/outcomes/colony';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { InputHandlerService } from 'src/app/core/services/input-handler.service';

@Component({
    selector: 'app-colony-detail',
    templateUrl: './colony-detail.component.html',
    styleUrls: ['./colony-detail.component.css'],
    standalone: false
})
export class ColonyDetailComponent implements OnInit {
  @Input() colony: Colony;
  @Input() canUpdate: boolean;
  @Input() isNew: boolean;

  backGroundStrains: NamedValue[];
  configurationData: ConfigurationData;

  constructor(private configurationDataService: ConfigurationDataService,
    private inputHandlerService: InputHandlerService) { }

  ngOnInit(): void {
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.backGroundStrains = this.configurationData.backgroundStrains.map(x => ({ name: x }));
    });
  }

  onCommentChanged(e) {
    this.colony.genotypingComment = this.inputHandlerService.getValueOrNull(e.target.value);
  }

}
