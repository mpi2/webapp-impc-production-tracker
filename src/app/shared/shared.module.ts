import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { NgxPaginationModule } from 'ngx-pagination';

// Own components
import { GoBackComponent } from './components/go-back/go-back.component';
import { HistoryComponent } from './components/history/history.component';

@NgModule({
  declarations: [GoBackComponent, HistoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    AutocompleteLibModule,
    Ng2SmartTableModule,
    MultiSelectModule,
    NgxPaginationModule,

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    NgMultiSelectDropDownModule,
    AutocompleteLibModule,
    Ng2SmartTableModule,
    MultiSelectModule,
    NgxPaginationModule,

    GoBackComponent]
})
export class SharedModule { }
