import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Mutation} from '../../../model/outcomes/mutation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MutationService} from '../../../services/mutation.service';
import {NamedValue} from 'src/app/core/model/common/named-value';
import {ConfigurationDataService, ConfigurationData} from 'src/app/core';
import {IndexedSequence} from 'src/app/feature-modules/sequences';
import {MatDialog} from '@angular/material/dialog';
import {InputHandlerService} from 'src/app/core/services/input-handler.service';
import {DeleteConfirmationComponent} from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import {Outcome} from '../../../model/outcomes/outcome';


@Component({
  selector: 'app-mutation-detail',
  templateUrl: './mutation-detail.component.html',
  styleUrls: ['./mutation-detail.component.css']
})
export class MutationDetailComponent implements OnInit {
  @Input() outcome: Outcome;
  @Input() mutation: Mutation;
  @Input() canUpdate: boolean;
  @Input() attemptType: string;

  @Output() mutationDeleted = new EventEmitter<Mutation>();

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  repairMechanismsNames: string;
  alleleCategoriesNames: string[];
  esCellAlleleTypes: string;

  selectedConsortium = '';
  selected: any;
  configurationData: ConfigurationData;

  consortia: NamedValue[] = [];
  molecularMutationTypes: NamedValue[] = [];
  mutationCategorizationsByType = new Map<string, NamedValue[]>();

  shouldSuggestSymbol: boolean;
  showSymbolMessageError: boolean;
  showGeneMessageError: boolean;
  symbolMessageError: string;
  repairMechanismKey = 'repair_mechanism';
  alleleCategoryKey = 'allele_category';
  esCellAlleleClass = 'esc_allele_class';

  mutationForm: FormGroup;

  geneSymbols = [];

  constructor(
    private formBuilder: FormBuilder,
    private mutationService: MutationService,
    private configurationDataService: ConfigurationDataService,
    public dialog: MatDialog,
    private inputHandlerService: InputHandlerService) {
  }

  ngOnInit(): void {
    this.showGeneMessageError = false;
    this.loadConfigurationData();
    this.setMutationCategorizationsData();
    this.shouldSuggestSymbol = this.mutation.symbol ? false : true;
    this.geneSymbols = this.mutation.genes.map(x => x.symbol);
    this.mutationForm = this.formBuilder.group({
      abbreviation: []
    });

  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    this.showGeneMessageError = true;
  }

  onInput(): void {
    this.showGeneMessageError = false;
  }

  setMutationCategorizationsData() {
    const mutationCategotizations = this.mutation.mutationCategorizations;
    if (mutationCategotizations) {
      const repairMechanisms = mutationCategotizations.filter(x => x.typeName === this.repairMechanismKey);
      this.repairMechanismsNames = repairMechanisms.map(x => x.name).join(',');

      const esCellAlleleTypes = mutationCategotizations.filter(x => x.typeName === this.esCellAlleleClass);
      this.esCellAlleleTypes = esCellAlleleTypes.map(x => x.name).join(',');

      const alleleCategories = mutationCategotizations.filter(x => x.typeName === this.alleleCategoryKey);
      this.alleleCategoriesNames = alleleCategories.map(x => x.name);
    }
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.consortia = this.configurationData.consortiaToConstructSymbols.map(x => ({name: x}));
      if (this.consortia.length > 0) {
        this.selectedConsortium = this.consortia[0].name;
      }

      this.molecularMutationTypes = this.configurationData.molecularMutationTypes.map(x => ({name: x}));

      Object.keys(this.configurationData.mutationCategorizationsByType).map(key => {
        const list = this.configurationData.mutationCategorizationsByType[key];
        this.mutationCategorizationsByType[key] = list.map(x => ({name: x}));
      });
    });
  }

  onSymbolSelected(e) {
    this.mutation.genes = this.geneSymbols.map(x => ({symbol: x}));
  }

  formatAlleleSymbol(symbol: string) {
    return this.mutationService.formatAlleleSymbol(symbol);
  }

  suggestSymbol() {
    const symbolSuggestionRequest = {
      consortiumAbbreviation: this.selectedConsortium,
    };

    this.mutation.symbolSuggestionRequest = symbolSuggestionRequest;
    this.mutationService.getSuggestedSymbol(this.mutation.pin, this.mutation).subscribe(data => {
      this.mutation.symbol = data;
      this.showSymbolMessageError = false;
      if (this.mutation.symbol.includes('Error')) {
        this.showSymbolMessageError = true;
        this.symbolMessageError = this.mutation.symbol;
        this.mutation.symbol = '';
      }
      this.mutation.symbol = this.mutation.symbol.replace(/'/g, '');
    }, error => {
      console.log(error);
    });
  }

  onRepairMechanismChanged(e) {
    const repairMechanismValue = e.value;
    // Delete previous value
    this.mutation.mutationCategorizations =
      this.mutation.mutationCategorizations.filter(x => x.typeName !== this.repairMechanismKey);
    const newRepairMechanism = {
      name: repairMechanismValue,
      typeName: this.repairMechanismKey
    };
    this.mutation.mutationCategorizations.push(newRepairMechanism);
  }

  onEsCellAlleleTypeChanged(e) {
    const esCellAlleleTypeValue = e.value;
    this.mutation.mutationCategorizations = this.mutation.mutationCategorizations.filter(x => x.typeName !== this.esCellAlleleClass);
    const newEsCellAlleleType = {
      name: esCellAlleleTypeValue,
      typeName: this.esCellAlleleClass
    };
    this.mutation.mutationCategorizations.push(newEsCellAlleleType);
  }

  onAlleleCategoriesChanged(e) {
    const alleleCategoriesValues: string[] = e.value;

    // Delete all the allele categories and set new values
    this.mutation.mutationCategorizations =
      this.mutation.mutationCategorizations.filter(x => x.typeName !== this.alleleCategoryKey);

    alleleCategoriesValues.forEach(x => {
      const alleleCategory = {
        name: x,
        typeName: this.alleleCategoryKey
      };
      this.mutation.mutationCategorizations.push(alleleCategory);
    });
  }

  onDeleteMutation() {
    if (this.mutation.min) {
      this.showDeleteMutationConfirmationDialog();

    } else {
      this.emmitMutationDeletion();
    }
  }

  emmitMutationDeletion() {
    this.mutationDeleted.emit(this.mutation);
  }

  showDeleteMutationConfirmationDialog() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: {confirmed: false}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.emmitMutationDeletion();
      }
    });
  }

  onDeleteSequence(indexedSequence: IndexedSequence) {
    if (this.isNewRecord(indexedSequence)) {
      this.deleteSequence(indexedSequence);
    } else {
      this.showDeleteConfirmationDialog(indexedSequence);
    }
  }

  deleteSequence(indexedSequence: IndexedSequence) {
    if (this.isNewRecord(indexedSequence)) {
      this.mutation.mutationSequences = this.mutation.mutationSequences
        .filter(x => x[this.tmpIndexRowName] !== indexedSequence[this.tmpIndexRowName]);
    } else {
      this.mutation.mutationSequences = this.mutation.mutationSequences
        .filter(x => x.id !== indexedSequence.id);
    }
  }

  showDeleteConfirmationDialog(indexedSequence: IndexedSequence) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: {confirmed: false}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteSequence(indexedSequence);
      }
    });
  }

  onDescriptionChanged(e) {
    this.mutation.description = this.inputHandlerService.getValueOrNull(e.target.value);
  }

  onQcNoteChanged(e) {
    this.mutation.qcNote = this.inputHandlerService.getValueOrNull(e.target.value);
  }

  private isNewRecord(indexedSequence: IndexedSequence) {
    return indexedSequence.id === null;
  }

  dataChanged(e) {
    this.mutation.isMutationDeletionChecked = e.checked;
  }

}
