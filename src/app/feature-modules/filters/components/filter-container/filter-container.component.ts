import { Component, OnInit, Input } from '@angular/core';
import { FilterDefinition } from '../../model/filter-definition';
import { FormGroup, FormControl } from '@angular/forms';
import { FilterService } from '../../services/filter.service';
import { FilterType } from '../../model/filter-type';

@Component({
  selector: 'app-filter-container',
  templateUrl: './filter-container.component.html',
  styleUrls: ['./filter-container.component.css']
})

export class FilterContainerComponent implements OnInit {
  @Input() filters: FilterDefinition[];


  filterForm: FormGroup;
  FilterType = FilterType;
  initialValues = [];
  changed = [];

  constructor(private filterService: FilterService) { }

  ngOnInit() {
    const controls = {
    };
    if (this.filters) {
      this.filters.forEach(filter => {
        if (filter.type === FilterType.Text) {
          controls[filter.name] = new FormControl([]);
        } else if (filter.type === FilterType.Checkboxes) {
          controls[filter.name] = new FormControl([]);
        }
        this.initialValues[filter.name] = this.getUnifiedValue(controls[filter.name].value);
      });
    }

    this.filterForm = new FormGroup(controls);
    this.filterForm.valueChanges.subscribe(value => {
      this.filterService.emitFilterChange(value);
      this.traceChange(value);
    });
  }

  traceChange(value) {
    Object.keys(value).map(key => {
      const content = this.getUnifiedValue(value[key]);
      const initialValue = this.initialValues[key];
      this.changed[key] = initialValue !== content;
    });
  }

  private getUnifiedValue(value): string {
    if (Array.isArray(value)) {
      return value.join('');
    } else {
      return value + '';
    }
  }

}
