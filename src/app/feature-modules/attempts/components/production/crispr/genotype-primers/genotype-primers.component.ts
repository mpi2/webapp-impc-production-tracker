import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CrisprAttempt, GenotypePrimer } from '../../../..';
import { MatDialog } from '@angular/material';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-genotype-primers',
  templateUrl: './genotype-primers.component.html',
  styleUrls: ['./genotype-primers.component.css']
})
export class GenotypePrimersComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;
  originaPrimers: GenotypePrimer[];
  dataSource: GenotypePrimer[];

  nextNewId = -1;

  editionStatusByGuide = new Map<number, string>();

  constructor(public dialog: MatDialog, private messageService: MessageService,private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.dataSource = this.crisprAttempt.genotype_primers_attributes;
    this.setEmptyEditionStatuses();
    this.setOriginalPrimers();
    //this.checkForUpdates();
  }

  setInitialData() {
    this.dataSource = this.crisprAttempt.genotype_primers_attributes;
    this.setEmptyEditionStatuses();
    this.setOriginalPrimers();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('HELLO',changes);
    if (changes.crisprAttempt) {
      console.log('CRISPR ATTEMPT CHANGED!!!!!!!!!');
      this.crisprAttempt = changes.crisprAttempt.currentValue;
      this.setInitialData();
      console.log('Now my datasource: ', this.dataSource);
    }
  }

  // Added to avoid ExpressionChangedAfterItHasBeenCheckedError error.
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  // getDeepCopy(object: any) {
  //   return JSON.parse(JSON.stringify(object));
  // }

  setOriginalPrimers() {
    this.originaPrimers = JSON.parse(JSON.stringify(this.crisprAttempt.genotype_primers_attributes));
  }

  // checkForUpdates() {
  //   console.log('reloading datasource...');
    
  //   this.messageService.getMessage().subscribe(data => {
  //     console.log('Got an update message in child');
  //     console.log('My primers are now', this.crisprAttempt.genotype_primers_attributes);
      
      
  //     if (data.message.planUpdated) {
  //       this.dataSource = [...this.crisprAttempt.genotype_primers_attributes];
  //       this.setOriginalPrimers();
  //       this.updateAllRowsStatus();
  //     }
  //   });
  // }

  setEmptyEditionStatuses() {
    this.crisprAttempt.genotype_primers_attributes.map(x => this.editionStatusByGuide.set(x.id, ''));
  }

  getEditionStatusForGuideId(id: number): string {
    return this.editionStatusByGuide.get(id);
  }

  onPrimerChanged(primer: GenotypePrimer) {
    primer.genomic_start_coordinate = this.getNumericValueOrNull(primer.genomic_start_coordinate);
    primer.genomic_end_coordinate = this.getNumericValueOrNull(primer.genomic_end_coordinate);

    this.updateRowStatus(primer);
  }
  updateAllRowsStatus() {
    this.crisprAttempt.genotype_primers_attributes.map(x => this.updateRowStatus(x));
  }

  updateRowStatus(primer: GenotypePrimer) {
    let originalPrimer = this.originaPrimers.find(x => x.id === primer.id);
    if (originalPrimer) {
      if (JSON.stringify(originalPrimer) != JSON.stringify(primer)) {
        this.editionStatusByGuide.set(primer.id, 'Modified in memory')
      }
      else {
        this.editionStatusByGuide.set(primer.id, '');
      }
    }
  }

  getNumericValueOrNull(value) {
    if (!value || isNaN(value) || '' === value) {
      return null;
    }
    return Number(value)
  }

  addPrimer() {
   // var result = document.getElementsByName("name");
    //console.log(result);
    

    let genotypePrimer: GenotypePrimer = new GenotypePrimer();
    genotypePrimer.id = this.nextNewId--;

    // this.dataSource.push(genotypePrimer);
    // let genotypePrimerWithoutId = this.getDeepCopy(genotypePrimer);
    // genotypePrimerWithoutId.id = null;
    // this.crisprAttempt.genotype_primers_attributes.push(genotypePrimerWithoutId);

    this.crisprAttempt.genotype_primers_attributes.push(genotypePrimer);
    this.editionStatusByGuide.set(genotypePrimer.id, 'Created in memory');
    this.dataSource = [...this.crisprAttempt.genotype_primers_attributes];
    console.log('pri', this.crisprAttempt.genotype_primers_attributes);
    console.log('ds', this.dataSource);
  }

  onClickToDeleteElement(primer: GenotypePrimer) {
    if (this.isElementCreatedOnlyInMemory(primer)) {
      console.log('Deleting this memo', primer);
      
      this.deletePrimerInMemory(primer);
    } else {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        width: '250px',
        data: { confirmed: false }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deletePrimerInMemory(primer);
        }
      });
    }
  }

  isElementCreatedOnlyInMemory(primer: GenotypePrimer): boolean {
    return primer.id < 0;
  }

  deletePrimerInMemory(primer: GenotypePrimer) {
    this.crisprAttempt.genotype_primers_attributes = this.crisprAttempt.genotype_primers_attributes.filter(x => x.id != primer.id);
    this.dataSource = [...this.crisprAttempt.genotype_primers_attributes];
  }

}
