import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    ConfirmationComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    MultiSelectModule,
    NgxPaginationModule,
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
    AutocompleteLibModule,
    NgMultiSelectDropDownModule.forRoot(),
    ReactiveFormsModule,
    Ng2SmartTableModule,
    MatSortModule,
    MatTableModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    NgxPaginationModule,
    ConfirmationComponent,
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
    AutocompleteLibModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    MatSortModule,
    MatTableModule
  ]
})
export class SharedModule { }
