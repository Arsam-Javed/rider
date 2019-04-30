import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DamageIssuesPage } from './damage-issues';

@NgModule({
  declarations: [
    DamageIssuesPage,
  ],
  imports: [
    IonicPageModule.forChild(DamageIssuesPage),
  ],
})
export class DamageIssuesPageModule {}
