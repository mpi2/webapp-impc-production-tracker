import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef, OnChanges, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';
import { GenotypePrimer } from 'src/app/feature-modules/attempts';

@Component({
    selector: 'app-genotype-primers',
    templateUrl: './genotype-primers.component.html',
    styleUrls: ['./genotype-primers.component.css'],
    standalone: false
})
export class GenotypePrimersComponent implements OnInit, OnChanges, AfterContentChecked {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;
  originaPrimers: GenotypePrimer[];
  dataSource: GenotypePrimer[];

  nextNewId = -1;


  constructor(public dialog: MatDialog, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.setInitialData();
  }

  setInitialData(): void {
    this.dataSource = this.crisprAttempt.genotypePrimers;
    this.setOriginalPrimers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.crisprAttempt) {
      this.crisprAttempt = changes.crisprAttempt.currentValue;
      this.setInitialData();
    }
  }

  // Added to avoid ExpressionChangedAfterItHasBeenCheckedError error.
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  setOriginalPrimers(): void {
    this.originaPrimers = JSON.parse(JSON.stringify(this.crisprAttempt.genotypePrimers));
  }

  onPrimerChanged(primer: GenotypePrimer): void {
    primer.genomicStartCoordinate = this.getNumericValueOrNull(primer.genomicStartCoordinate);
    primer.genomicEndCoordinate = this.getNumericValueOrNull(primer.genomicEndCoordinate);
  }



  getNumericValueOrNull(value): number {
    if (!value || isNaN(value) || '' === value) {
      return null;
    }
    return Number(value);
  }

  addPrimer(): void {
    const genotypePrimer: GenotypePrimer = new GenotypePrimer();
    genotypePrimer.id = this.nextNewId--;

    this.crisprAttempt.genotypePrimers.push(genotypePrimer);
    this.dataSource = [...this.crisprAttempt.genotypePrimers];
  }

  onClickToDeleteElement(primer: GenotypePrimer): void {
    if (this.isElementCreatedOnlyInMemory(primer)) {
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

  deletePrimerInMemory(primer: GenotypePrimer): void {
    this.crisprAttempt.genotypePrimers = this.crisprAttempt.genotypePrimers.filter(x => x.id !== primer.id);
    this.dataSource = [...this.crisprAttempt.genotypePrimers];
  }
}
