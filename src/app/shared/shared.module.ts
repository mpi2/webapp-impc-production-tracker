import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule} from 'primeng/dropdown';
import { MultiSelectModule} from 'primeng/multiselect';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DropdownModule,
    MultiSelectModule,
    NgxPaginationModule,
    NgbModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    NgxPaginationModule,
    NgbModule
  ]
})
export class SharedModule { }
