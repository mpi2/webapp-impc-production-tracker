import { Component, OnInit, Input } from '@angular/core';
import { Filter } from '../../model/filter';
import { FormGroup, FormControl } from '@angular/forms';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filter-container',
  templateUrl: './filter-container.component.html',
  styleUrls: ['./filter-container.component.css']
})
export class FilterContainerComponent implements OnInit {
  @Input() filters: Filter[];

  filterForm: FormGroup;

  constructor(private filterService: FilterService) { }

  ngOnInit() {
    console.log('filters--->', this.filters);
    const controls = {
      // search: new FormControl('')
    };
    this.filters.forEach(filter => {
      if (filter.type === 'text') {
        controls[filter.name] = new FormControl([]);
      } else if (filter.type === 'checkboxes') {
        controls[filter.name] = new FormControl([]);
      }
    });
    this.filterForm = new FormGroup(controls);
    this.filterForm.valueChanges.subscribe(value => this.filterService.emitFilterChange(value));
  }

}
