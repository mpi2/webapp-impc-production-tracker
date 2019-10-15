import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { IntentionByGeneComponent } from './components/intention-by-gene/intention-by-gene.component';
import { IntentionByLocationComponent } from './components/intention-by-location/intention-by-location.component';
import { GenesModule } from '../genes/genes.module';
import { LocationsModule } from '../locations/locations.module';
import { IntentionByGeneListComponent } from './components/intention-by-gene-list/intention-by-gene-list.component';
import { IntentionByLocationListComponent } from './components/intention-by-location-list/intention-by-location-list.component';

@NgModule({
  declarations: [
    IntentionByGeneComponent,
    IntentionByGeneListComponent,
    IntentionByLocationComponent,
    IntentionByLocationListComponent
  ],
  imports: [
    SharedModule,
    GenesModule,
    LocationsModule,
  ],
  exports: [
    IntentionByGeneComponent,
    IntentionByGeneListComponent,
    IntentionByLocationComponent,
    IntentionByLocationListComponent
  ]
})
export class IntentionsModule { }
