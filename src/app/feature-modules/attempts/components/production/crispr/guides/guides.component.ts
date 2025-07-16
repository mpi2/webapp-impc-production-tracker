import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';
import { Exon, Guide } from 'src/app/feature-modules/attempts';
import { GeneService } from 'src/app/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { AttemptServiceService } from 'src/app/feature-modules/attempts/services/attempt-service.service';
import { NamedValue } from 'src/app/core/model/common/named-value';


@Component({
    selector: 'app-guides',
    templateUrl: './guides.component.html',
    styleUrls: ['./guides.component.css'],
    standalone: false
})
export class GuidesComponent implements OnInit {
  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  sameConcentrationForAll = true;
  guidesForm: FormGroup;
  concentrationForm: FormGroup;
  getGuidesForm: FormGroup;

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  error: string;
  exons: Exon[];
  geneSymbol: string;
  guides: Guide[];
  guides1: Guide[];

  displayedExonColumns = ['exon_id'];
  displayedGuideColumns = ['sequence'];
  strands = ['+', '-'];
  genomeBuilds = ['NA', 'GRCm38', 'GRCm39'];
  highlightedRows = [];
  isLoadingExons = false;

  searchGene = new FormControl();
  filteredGenes: any;
  isLoading = false;
  errorMsg: string;

  configurationData: ConfigurationData;
  formatNames: NamedValue[];
  sourceNames: NamedValue[];

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private attemptService: AttemptServiceService,
    private geneService: GeneService,
    private configurationDataService: ConfigurationDataService
  ) { }

  ngOnInit() {
    this.guidesForm = this.formBuilder.group({
      groupConcentration: [''],
    });
    this.concentrationForm = this.formBuilder.group({
    });
    this.getGuidesForm = this.formBuilder.group({
    });

    const sameConcentration = this.isConcentrationTheSameForAllGuides();
    if (sameConcentration) {
      this.guidesForm.get('groupConcentration').setValue(this.getCommonConcentration());
    }

    this.sameConcentrationForAll = sameConcentration;

    this.searchGene.valueChanges
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
          const key = 'Error';
          this.errorMsg = data[key];
          this.filteredGenes = [];
        } else {
          this.errorMsg = '';
          this.filteredGenes = data;
        }
      });

    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.formatNames = this.configurationData.guideFormatNames.map(x => ({ name: x }));
      this.sourceNames = this.configurationData.guideSourceNames.map(x => ({ name: x }));
    });

    this.crisprAttempt.guides.sort((guide1, guide2) => guide1.id - guide2.  id);
  }

  highlightExon(row) {
    if (this.highlightedRows.indexOf(row) > -1) {
      this.highlightedRows.splice(this.highlightedRows.indexOf(row), 1);
    } else {
      this.highlightedRows = [];
      this.highlightedRows.push(row);
    }
    if (this.highlightedRows.length === 0) {
      this.guides = [];
    }
  }

  highlightSequence(row) {
    row.rowClicked = !row.rowClicked;
  }

  findGuides() {
    if (this.geneSymbol === undefined || this.geneSymbol === '') {
      this.error = 'Enter a valid gene symbol.';
      console.log('error => ', this.error);
    } else {
      this.isLoadingExons = true;
      this.attemptService.getExonsFromWge(this.geneSymbol).subscribe(data => {
        this.exons = data;
        this.error = '';
        this.isLoadingExons = false;
      }, error => {
        this.error = error;
        this.isLoadingExons = false;
      });
    }
  }

  selectedGene(gene: any) {
    if (gene === undefined) {
      this.error = 'Enter a valid gene symbol.';
      this.geneSymbol = undefined;
      this.exons = undefined;
      this.guides = undefined;
    } else {
      this.geneSymbol = gene.symbol;
      this.exons = undefined;
      this.guides = undefined;
      this.error = '';
    }
  }

  exonSelected(exon: Exon, click: boolean) {
    if (click === true) {
      this.guides = exon.guideDetails;
    } else {
      this.guides = undefined;
    }
  }

  sequenceSelected(guide: Guide, click: boolean) {
    guide[this.tmpIndexRowName] = this.nextNewId--;
    if (click === true) {
      this.crisprAttempt.guides.push(guide);

    } else {
      this.crisprAttempt.guides = this.crisprAttempt.guides.filter(({ guideSequence }) => guideSequence !== guide.guideSequence);
    }

  }

  getCommonConcentration(): number {
    let result = null;
    if (this.crisprAttempt.guides) {
      const guide = this.crisprAttempt.guides[0];
      if (guide) {
        result = guide.grnaConcentration;
      }
    }
    return result;
  }

  isConcentrationTheSameForAllGuides(): boolean {
    const concentrations = this.crisprAttempt.guides.filter(x => x.grnaConcentration).map(x => x.grnaConcentration);
    return concentrations.every(v => v === concentrations[0]);
  }

  onSetIndividualConcentrationsClicked(e) {
    this.sameConcentrationForAll = !e.target.checked;
  }

  onGroupConcentrationChanged() {
    const groupConcentrationText = this.guidesForm.get('groupConcentration').value;
    if (groupConcentrationText) {
      const concentration = Number(groupConcentrationText);
      if (concentration) {
        this.crisprAttempt.guides.map(x => x.grnaConcentration = concentration);
      }
    }
  }

  onIndividualConcentrationChanged(guide: Guide) {
    guide.grnaConcentration = Number(guide.grnaConcentration);
  }

  addRow() {
    const guide: Guide = new Guide();
    guide[this.tmpIndexRowName] = this.nextNewId--;
    this.crisprAttempt.guides.push(guide);
  }

  deleteRow(guide: Guide) {
    if (this.isNewRecord(guide)) {
      this.deleteGuide(guide);
    } else {
      this.showDeleteConfirmationDialog(guide);
    }
  }

  showDeleteConfirmationDialog(guide: Guide) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { confirmed: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteGuide(guide);
      }
    });
  }

  deleteGuide(guide: Guide) {
    if (this.isNewRecord(guide)) {
      this.crisprAttempt.guides = this.crisprAttempt.guides
        .filter(x => x[this.tmpIndexRowName] !== guide[this.tmpIndexRowName]);
    } else {
      this.crisprAttempt.guides = this.crisprAttempt.guides
        .filter(x => x.id !== guide.id);
    }
    this.highlightSequence(guide);
  }

  private isNewRecord(guide: Guide) {
    return guide.id === null;
  }

}
