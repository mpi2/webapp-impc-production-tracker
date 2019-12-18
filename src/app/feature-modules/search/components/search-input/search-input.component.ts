import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {
  @Output() newInputFileSelected = new EventEmitter<any>();
  @Output() searchDefined = new EventEmitter<any>();
  @Output() inputTextChanged = new EventEmitter<boolean>();

  @ViewChild('csvReader', { static: false }) csvReader: any;

  selectedFile: any = null;
  textAreaContent = '';

  constructor() { }

  ngOnInit() {
  }

  fileSelected(e) {
    const input = e.target;
    if (input.files) {
      const file = input.files[0];
      this.selectedFile = file;
      this.newInputFileSelected.emit(file);
    }
  }

  search() {
    console.log(this.textAreaContent);
    let searchInput;
    if (this.selectedFile) {
      searchInput = { type: 'file', value: this.selectedFile };
    } else {
      searchInput = { type: 'text', value: this.textAreaContent };
    }
    this.searchDefined.emit(searchInput);
  }

  checkIfValidStatus() {
    return this.textAreaContent !== '' || this.selectedFile;
  }

  onInputTextChanged(event) {
    this.inputTextChanged.emit(event.target.value);
    this.clearAnySelectedFile();
  }

  clearAnySelectedFile() {
    console.log('clear file!', this.csvReader);
    this.csvReader.nativeElement.value = '';
    this.selectedFile = null;
  }
}
