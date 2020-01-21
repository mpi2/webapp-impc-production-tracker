import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filterChange: EventEmitter<any> = new EventEmitter();
  searchChange: EventEmitter<any> = new EventEmitter();
  filterLoaded: EventEmitter<any> = new EventEmitter();
  public filter = {};

  constructor() { }

  emitFilterChange(filter) {
    this.filter = filter;
    this.filterChange.emit(filter);
  }

  emitFilterLoaded(loaded) {
    this.filterLoaded.emit(loaded);
  }

  getFilterChange() {
    return this.emitFilterChange;
  }

  changeSearchValue(text) {
    this.searchChange.emit(text);
  }

  public buildValidFilter(originalFilter) {
    const validFilter = {};
    Object.keys(originalFilter).map(key => {
      const content = originalFilter[key];
      const filterContent = this.getFilterByKeyAndContent(content);
      if (filterContent) {
        validFilter[key] = filterContent;
      }
    });
    return validFilter;
  }

  private getFilterByKeyAndContent(content) {
    return this.getValidFilterContent(content);
  }

  private getValidFilterContent(content) {
    let validContent;
    if (Array.isArray(content)) {
      if (content.length > 0) {
        validContent = content;
      }
    } else {
      if (content !== '') {
        validContent = content.trim();
      }
    }
    return validContent;
  }
}
