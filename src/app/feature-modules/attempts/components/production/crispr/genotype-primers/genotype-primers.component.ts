import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef, OnChanges, AfterContentChecked } from '@angular/core';
import { CrisprAttempt, GenotypePrimer } from '../../../..';
import { MatDialog } from '@angular/material';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-genotype-primers',
  templateUrl: './genotype-primers.component.html',
  styleUrls: ['./genotype-primers.component.css']
})
export class GenotypePrimersComponent implements OnInit, OnChanges, AfterContentChecked {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;
  originaPrimers: GenotypePrimer[];
  dataSource: GenotypePrimer[];

  nextNewId = -1;

  editionStatusByGuide = new Map<number, string>();

  constructor(public dialog: MatDialog, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.setInitialData();
  }

  setInitialData(): void {
    this.dataSource = this.crisprAttempt.genotypePrimersAttributes;
    this.setEmptyEditionStatuses();
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
    this.originaPrimers = JSON.parse(JSON.stringify(this.crisprAttempt.genotypePrimersAttributes));
  }

  setEmptyEditionStatuses(): void {
    this.crisprAttempt.genotypePrimersAttributes.map(x => this.editionStatusByGuide.set(x.id, ''));
  }

  getEditionStatusForGuideId(id: number): string {
    return this.editionStatusByGuide.get(id);
  }

  onPrimerChanged(primer: GenotypePrimer): void {
    primer.genomicStartCoordinate = this.getNumericValueOrNull(primer.genomicStartCoordinate);
    primer.genomicEndCoordinate = this.getNumericValueOrNull(primer.genomicEndCoordinate);

    this.updateRowStatus(primer);
  }

  updateAllRowsStatus(): void {
    this.crisprAttempt.genotypePrimersAttributes.map(x => this.updateRowStatus(x));
  }

  updateRowStatus(primer: GenotypePrimer): void {
    const originalPrimer = this.originaPrimers.find(x => x.id === primer.id);
    if (originalPrimer) {
      if (JSON.stringify(originalPrimer) !== JSON.stringify(primer)) {
        this.editionStatusByGuide.set(primer.id, 'Modified in memory');
      } else {
        this.editionStatusByGuide.set(primer.id, '');
      }
    }
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

    this.crisprAttempt.genotypePrimersAttributes.push(genotypePrimer);
    this.editionStatusByGuide.set(genotypePrimer.id, 'Created in memory');
    this.dataSource = [...this.crisprAttempt.genotypePrimersAttributes];
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
    this.crisprAttempt.genotypePrimersAttributes = this.crisprAttempt.genotypePrimersAttributes.filter(x => x.id !== primer.id);
    this.dataSource = [...this.crisprAttempt.genotypePrimersAttributes];
  }
}
