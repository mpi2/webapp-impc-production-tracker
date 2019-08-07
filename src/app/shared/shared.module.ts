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
import {
  MatExpansionModule, MatFormFieldModule, MatInputModule, MatToolbarModule,
  MatTooltipModule, MatButtonModule, MatCardModule, MatMenuModule, MatGridListModule,
  MatSnackBarModule, MatDatepickerModule, MatNativeDateModule
} from '@angular/material';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { FlexLayoutModule } from '@angular/flex-layout';

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
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    A11yModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    MatCardModule,
    MatInputModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule

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
    MatExpansionModule,
    MatFormFieldModule,
    GoBackComponent,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    A11yModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    MatCardModule,
    MatInputModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class SharedModule { }
