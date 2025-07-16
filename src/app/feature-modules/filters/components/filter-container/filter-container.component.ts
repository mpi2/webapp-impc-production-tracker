import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FilterDefinition} from '../../model/filter-definition';
import {FormControl, FormGroup} from '@angular/forms';
import {FilterService} from '../../services/filter.service';
import {FilterType} from '../../model/filter-type';

@Component({
    selector: 'app-filter-container',
    templateUrl: './filter-container.component.html',
    styleUrls: ['./filter-container.component.css'],
    standalone: false
})

export class FilterContainerComponent implements OnInit {
  @Input() filters: FilterDefinition[];
  @Input() filtersInitialValues: any;
  @Output() filterLoaded = new EventEmitter<boolean>();

  filterForm: FormGroup;
  filterType = FilterType;
  initialValues = [];
  changed = [];
  wasAnyInitialValueSet = false;

  constructor(private filterService: FilterService) { }

  ngOnInit() {
    const controls = {};
    if (this.filters) {
      this.filters.forEach(filter => {
        controls[filter.name] = new FormControl([]);
        this.initialValues[filter.name] = this.getUnifiedValue(controls[filter.name].value);
      });
    }

    this.filterForm = new FormGroup(controls);
    this.filterForm.valueChanges.subscribe(value => {
      this.filterService.emitFilterChange(value);
      this.traceChange(value);

    });

    this.setInitialValues();
    this.filterService.emitFilterLoaded(true);
  }

  public setFiltersInitialValues(filtersInitialValues) {
    this.filtersInitialValues = filtersInitialValues;
    this.filterForm.setValue(filtersInitialValues);
  }

  traceChange(value) {
    Object.keys(value).map(key => {
      const content = this.getUnifiedValue(value[key]);
      const initialValue = this.initialValues[key];
      this.changed[key] = initialValue !== content;
    });
  }

  public clearFilters() {
    const controls = this.filterForm.controls;
    Object.keys(controls).map(key => {
      controls[key].setValue([]);
    });
  }

  private setInitialValues() {
    const controls = this.filterForm.controls;
    Object.keys(controls).map(key => {
      const initialValue = this.getInitialValueForFilter(key);
      if (initialValue) {
        controls[key].setValue(initialValue);
      }
    });
  }

  private getInitialValueForFilter(filterName) {
    let initialValue;
    if (this.filtersInitialValues) {
      initialValue = this.filtersInitialValues[filterName];
      initialValue = this.getContentAsArray(initialValue);
    }
    return initialValue;
  }

  private getContentAsArray(content) {
    let contentAsArray = content;
    if (content && !Array.isArray(content)) {
      contentAsArray = [content];
    }
    return contentAsArray;
  }

  private getUnifiedValue(value): string {
    if (Array.isArray(value)) {
      return value.join('');
    } else {
      return value + '';
    }
  }

}
