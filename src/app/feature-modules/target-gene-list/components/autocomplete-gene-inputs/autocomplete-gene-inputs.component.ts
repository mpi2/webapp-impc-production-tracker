import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { GeneService, Gene } from 'src/app/core';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { GeneListRecord } from 'src/app/model';

@Component({
    selector: 'app-autocomplete-gene-inputs',
    templateUrl: './autocomplete-gene-inputs.component.html',
    styleUrls: ['./autocomplete-gene-inputs.component.css'],
    standalone: false
})
export class AutocompleteGeneInputsComponent implements OnInit {

  @Input() record: GeneListRecord;
  @ViewChild('geneInput') geneInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  
  readonly GENE_SYMBOL_LENGTH_THRESHOLD = 3;
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  genesCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private geneService: GeneService) { }

  ngOnInit() {
  }

  public onSearchChange(value: string) {
    this.resetGeneSymbolValuesIfNeeded(value);
    if (value.length === this.GENE_SYMBOL_LENGTH_THRESHOLD) {
      this.geneService.findGenesNamesStartingWith(value).subscribe(x => {
        this.options = x;
        this.filteredOptions = of(x);
      });
    } else {
      this.filteredOptions = of(this.filter(value));
    }
  }

  resetGeneSymbolValuesIfNeeded(value: string) {
    if (value.length < this.GENE_SYMBOL_LENGTH_THRESHOLD) {
      this.resetGeneSymbolSuggestionList();
    }
  }

  resetGeneSymbolSuggestionList() {
    this.options = [];
    this.filteredOptions = of([]);
  }

  public getGenesNamesByElement(): string[] {
    return this.record.genes.map(x => x.symbol);
  }

  add(event: MatChipInputEvent): void {
    // Add only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.addGeneToRecord(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.genesCtrl.setValue(null);
    }
  }

  public remove(label: string): void {
    this.removeGeneFromRecord(label);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addGeneToRecord(event.option.viewValue);
    this.geneInput.nativeElement.value = '';
    this.genesCtrl.setValue(null);
  }

  private removeGeneFromRecord(label: string) {
    const genes: Gene[] = this.record.genes;
    const index = genes.findIndex(x => x.symbol === label);
    if (index >= 0) {
      genes.splice(index, 1);
    }
  }

  // Add the new gene object to the current record (if it does not exist already)
  private addGeneToRecord(label: string) {
    const genes: Gene[] = this.record.genes;
    const alreadyExistingGene = genes.find(x => x.symbol === label);
    if (!alreadyExistingGene) {
      const newGene = new Gene();
      newGene.symbol = label;
      genes.push(newGene);
    }
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


}
