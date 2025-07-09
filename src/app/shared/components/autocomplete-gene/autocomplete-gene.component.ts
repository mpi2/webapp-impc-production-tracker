import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Gene, GeneService } from 'src/app/core';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
    selector: 'app-autocomplete-gene',
    templateUrl: './autocomplete-gene.component.html',
    styleUrls: ['./autocomplete-gene.component.css'],
    standalone: false
})
export class AutocompleteGeneComponent implements OnInit {
  @Input() symbols: string[];
  @Output() symbolSelectedEmmiter = new EventEmitter<string[]>();
  @ViewChild('geneInput') geneInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  readonly GENE_SYMBOL_LENGTH_THRESHOLD = 3;

  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  genesCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private geneService: GeneService) { }

  ngOnInit(): void {
  }

  public onSearchChange(value: string) {
    this.resetGeneSymbolValuesIfNeeded(value);
    if (value.length <= this.GENE_SYMBOL_LENGTH_THRESHOLD) {
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
    return this.symbols.map(x => x);
  }

  add(event: MatChipInputEvent): void {
    // Add only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.addGeneToList(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.genesCtrl.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addGeneToList(event.option.viewValue);
    this.geneInput.nativeElement.value = '';
    this.genesCtrl.setValue(null);
    this.symbolSelectedEmmiter.emit(this.symbols);
  }

  remove(label: string) {
    this.removeGeneFromList(label);
    this.symbolSelectedEmmiter.emit(this.symbols);
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  // Add the new gene object to the current record (if it does not exist already)
  private addGeneToList(label: string) {
    if (!this.symbols) {
      this.symbols = [];
    }
    const alreadyExistingGene = this.symbols.find(x => x === label);
    if (!alreadyExistingGene) {
      this.symbols.push(label);
    }
  }

  private removeGeneFromList(label: string) {
    const index = this.symbols.findIndex(x => x === label);
    if (index >= 0) {
      this.symbols.splice(index, 1);
    }
  }

}
