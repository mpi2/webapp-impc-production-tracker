import { Component, OnInit, Input } from '@angular/core';
import { Mutation } from '../../../model/outcomes/mutation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MutationService } from '../../../services/mutation.service';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { Project } from 'src/app/model';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';

@Component({
  selector: 'app-mutation-detail',
  templateUrl: './mutation-detail.component.html',
  styleUrls: ['./mutation-detail.component.css']
})
export class MutationDetailComponent implements OnInit {
  @Input() mutation: Mutation;
  @Input() project: Project;
  @Input() canUpdate: boolean;

  repairMechanismsNames: string;

  selectedConsortium: string;
  selected: any;
  configurationData: ConfigurationData;
  consortia: NamedValue[] = [];
  geneSymbolsOrAccessionIds: string[] = [];
  shouldSuggestSymbol: boolean;

  mutationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private mutationService: MutationService,
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit(): void {
    this.loadConfigurationData();
    const repairMechanisms = this.mutation.mutationCategorizations.filter(x => x.typeName === 'repair_mechanism');
    this.repairMechanismsNames = repairMechanisms.map(x => x.name).join(',');
    this.geneSymbolsOrAccessionIds = this.mutation.genes.map(x => x.symbol);
    this.mutation.geneSymbolsOrAccessionIds = this.geneSymbolsOrAccessionIds;
    this.shouldSuggestSymbol = this.mutation.symbol ? false : true;
    this.mutationForm = this.formBuilder.group({
      abbreviation: []
    });
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.consortia = this.configurationData.consortiaToConstructSymbols.map(x => ({ name: x }));
    });
  }

  formatAlleleSymbol(symbol: string) {
    return this.mutationService.formatAlleleSymbol(symbol);
  }

  suggestSymbol() {
    console.log('this.mutation', this.mutation);
    console.log('selectedConsortium', this.selectedConsortium);


    const symbolSuggestionRequest = {
      consortiumAbbreviation: 'IMPC',
      excludeConsortiumAbbreviation: false
    };
    this.mutation.symbolSuggestionRequest = symbolSuggestionRequest;
    this.mutationService.getSuggestedSymbol(this.mutation.pin, this.mutation).subscribe(data => {
      this.mutation.symbol = data;

    }, error => {
      // this.error = error;
      console.log(error);
    });
  }

}
