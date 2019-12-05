import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatTooltipModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatGridListModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatSlideToggleModule
} from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';

// Own components
import { GoBackComponent } from './components/go-back/go-back.component';
import { HistoryComponent } from './components/history/history.component';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { ExpandableContentComponent } from './components/expandable-content/expandable-content.component';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { InformativeDialogComponent } from './components/informative-dialog/informative-dialog.component';
import { CSVLoaderComponent } from './components/csvloader/csvloader.component';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [
    GoBackComponent,
    HistoryComponent,
    DeleteConfirmationComponent,
    ExpandableContentComponent,
    DigitOnlyDirective,
    InformativeDialogComponent,
    CSVLoaderComponent,
    DialogBoxComponent],
  imports: [
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
    FlexLayoutModule,
    LayoutModule,
    MatBadgeModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatAutocompleteModule,
    Ng7BootstrapBreadcrumbModule,
    MatStepperModule,
    MatListModule
  ],
  exports: [
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    DigitOnlyDirective,
    MatExpansionModule,
    MatFormFieldModule,
    GoBackComponent,
    CSVLoaderComponent,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
    FlexLayoutModule,
    LayoutModule,
    MatBadgeModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatAutocompleteModule,
    Ng7BootstrapBreadcrumbModule,
    MatStepperModule,
    MatListModule
  ],
  entryComponents: [
    DeleteConfirmationComponent, InformativeDialogComponent, DialogBoxComponent
  ],
})
export class SharedModule { }
