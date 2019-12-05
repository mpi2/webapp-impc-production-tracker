import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filterChange: EventEmitter<any> = new EventEmitter();
  searchChange: EventEmitter<any> = new EventEmitter();
  public filter = {};

  constructor() {}

  emitFilterChange(filter) {
    this.filter = filter;
    this.filterChange.emit(filter);
  }

  getFilterChange() {
    return this.emitFilterChange;
  }

  changeSearchValue(text) {
    this.searchChange.emit(text);
  }
}
