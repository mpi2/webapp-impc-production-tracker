import { Component, OnInit, Input} from '@angular/core';
import { Mutation } from '../../../model/outcomes/mutation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MutationService } from '../../../services/mutation.service';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';

@Component({
  selector: 'app-mutation-detail',
  templateUrl: './mutation-detail.component.html',
  styleUrls: ['./mutation-detail.component.css']
})
export class MutationDetailComponent implements OnInit {
  @Input() mutation: Mutation;
  @Input() canUpdate: boolean;

  repairMechanismsNames: string;
  alleleCategories: [];

  selectedConsortium: string;
  selected: any;
  configurationData: ConfigurationData;

  consortia: NamedValue[] = [];
  molecularMutationTypes: NamedValue[] = [];
  molecularMutationTypesByType = new Map<string, NamedValue[]>();

  shouldSuggestSymbol: boolean;

  repairMechanismKey = 'repair_mechanism';
  alleleCategoryKey = 'allele_category';

  mutationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private mutationService: MutationService,
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit(): void {
    this.loadConfigurationData();
    const repairMechanisms = this.mutation.mutationCategorizations.filter(x => x.typeName === 'repair_mechanism');
    this.repairMechanismsNames = repairMechanisms.map(x => x.name).join(',');
    this.shouldSuggestSymbol = this.mutation.symbol ? false : true;
    this.mutationForm = this.formBuilder.group({
      abbreviation: []
    });
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.consortia = this.configurationData.consortiaToConstructSymbols.map(x => ({ name: x }));
      this.molecularMutationTypes = this.configurationData.molecularMutationTypes.map(x => ({ name: x }));

      Object.keys(this.configurationData.mutationCategorizationsByType).map(key => {
        const list = this.configurationData.mutationCategorizationsByType[key];
        this.molecularMutationTypesByType[key] = list.map(x => ({ name: x }));
      });
    });
  }

  formatAlleleSymbol(symbol: string) {
    return this.mutationService.formatAlleleSymbol(symbol);
  }

  suggestSymbol() {
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

  onRepairMechanismChanged(e) {
    console.log('onRepairMechanismChanged');
    const repairMechanismList = this.mutation.mutationCategorizations.filter(x => x.typeName === 'repair_mechanism');
    if (repairMechanismList && repairMechanismList.length > 0) {
      const repairMechanism = repairMechanismList[0];
      repairMechanism.name = e.value;
    }
  }

  changeViewMode(event) {
    this.canUpdate = event.checked;
  }

  print() {
    console.log(this.mutation.geneSymbolsOrAccessionIds);
  }

}
