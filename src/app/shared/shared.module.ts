import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';

// Own components
import { GoBackComponent } from './components/go-back/go-back.component';
import { HistoryComponent } from './components/history/history.component';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { ExpandableContentComponent } from './components/expandable-content/expandable-content.component';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { InformativeDialogComponent } from './components/informative-dialog/informative-dialog.component';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { LayoutModule } from '@angular/cdk/layout';
import { StatusTransitionComponent } from './components/status-transition/status-transition.component';
import { StatusDateComponent } from './components/status-date/status-date.component';
import { AutocompleteGeneComponent } from './components/autocomplete-gene/autocomplete-gene.component';
import { PlanCreationComponent } from './components/plan-creation/plan-creation.component';

@NgModule({
  declarations: [
    GoBackComponent,
    HistoryComponent,
    DeleteConfirmationComponent,
    ExpandableContentComponent,
    DigitOnlyDirective,
    InformativeDialogComponent,
    DialogBoxComponent,
    StatusTransitionComponent,
    StatusDateComponent,
    AutocompleteGeneComponent,
    PlanCreationComponent
  ],
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
    StatusTransitionComponent,
    StatusDateComponent,
    AutocompleteGeneComponent,
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
    MatStepperModule,
    MatListModule,
    PlanCreationComponent
  ],
  entryComponents: [
    DeleteConfirmationComponent, InformativeDialogComponent, DialogBoxComponent
  ],
})
export class SharedModule { }
