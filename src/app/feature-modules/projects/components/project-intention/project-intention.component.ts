import { Component, OnInit, Input } from '@angular/core';
import { ConfigurationData, ConfigurationDataService, Gene, GeneService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { ProjectCreation } from '../../model/project-creation';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { ProjectIntention } from '../../model/project-intention';
import { IntentionByGene, MutationCategorization } from 'src/app/model';

@Component({
  selector: 'app-project-intention',
  templateUrl: './project-intention.component.html',
  styleUrls: ['./project-intention.component.css']
})
export class ProjectIntentionComponent implements OnInit {
  @Input() projectCreation: ProjectCreation;

  configurationData: ConfigurationData;
  allMutationCategorizations: NamedValue[];
  molecularMutationTypes: NamedValue[];

  searchGeneCtrl = new FormControl();
  filteredGenes: any;
  isLoading = false;
  errorMsg: string;

  mutationCategorizationNames: string[];

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  constructor(
    private configurationDataService: ConfigurationDataService,
    public dialog: MatDialog,
    private geneService: GeneService
  ) { }

  ngOnInit() {
    this.loadConfigurationData();

    this.searchGeneCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = '';
          this.filteredGenes = [];
          this.isLoading = true;
        }),
        switchMap(value => this.geneService.findGenesExternalDataBySymbol(value)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe(data => {
        if (data.length === 0) {
          // this.errorMsg = data['Error'];
          this.errorMsg = 'Symbol does not exist.';
          this.filteredGenes = [];
        } else {
          this.errorMsg = '';
          this.filteredGenes = data;
        }
      });
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.allMutationCategorizations = this.configurationData.mutationCategorizations.map(x => ({ name: x }));
      this.molecularMutationTypes = this.configurationData.molecularMutationTypes.map(x => ({ name: x }));
    });
  }

  addRow() {
    const intention: ProjectIntention = new ProjectIntention();
    intention[this.tmpIndexRowName] = this.nextNewId--;
    if (!this.projectCreation.projectIntentions) {
      this.projectCreation.projectIntentions = [];
    }
    this.projectCreation.projectIntentions.push(intention);
  }

  addGeneToIntention(projectIntention: ProjectIntention, gene: any) {
    projectIntention.intentionByGene = new IntentionByGene();
    projectIntention.intentionByGene.gene = new Gene();
    projectIntention.intentionByGene.gene.symbol = gene.symbol;
    projectIntention.intentionByGene.gene.accessionId = gene.accId;
  }

  addMutationCategorization(projectIntention: ProjectIntention, names: string[]) {
    projectIntention.mutationCategorizations = [];
    names.forEach((name) => {
      const mutationCategorization = new MutationCategorization();
      mutationCategorization.name = name;
      projectIntention.mutationCategorizations.push(mutationCategorization);
    });
  }

  deleteRow(intention: ProjectIntention) {
    if (this.isNewRecord(intention)) {
      this.deleteProjectIntention(intention);
    } else {
      this.showDeleteConfirmationDialog(intention);
    }
  }

  showDeleteConfirmationDialog(intention: ProjectIntention) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { confirmed: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProjectIntention(intention);
      }
    });
  }

  deleteProjectIntention(intention: ProjectIntention) {
    if (this.isNewRecord(intention)) {
      this.projectCreation.projectIntentions = this.projectCreation.projectIntentions
        .filter(x => x[this.tmpIndexRowName] !== intention[this.tmpIndexRowName]);
    } else {
      this.projectCreation.projectIntentions = this.projectCreation.projectIntentions
        .filter(x => x.id !== intention.id);
    }
  }

  private isNewRecord(intention: ProjectIntention) {
    return intention.id == null;
  }
}
