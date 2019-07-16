import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneSearchComponent } from './gene-search';

const routes: Routes = [
    {
      path: 'search',
      component: GeneSearchComponent
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class GenesRouting { 
  }