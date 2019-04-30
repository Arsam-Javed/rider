import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapLivePage } from './map-live';

@NgModule({
  declarations: [
    MapLivePage,
  ],
  imports: [
    IonicPageModule.forChild(MapLivePage),
  ],
})
export class MapLivePageModule {}
