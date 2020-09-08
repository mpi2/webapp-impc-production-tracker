import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ProfileEditorComponent } from './components/profile-editor/profile-editor.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ProfileEditorComponent],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
