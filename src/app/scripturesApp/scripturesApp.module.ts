import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScriptureSelectorComponent } from './scriptureSelector/scritpureSelector.component';
import { RandomScriptureComponent } from './randomScripture/randomScripture.component';
import { ScripturesAppComponent } from './scripturesApp.component';
import { ScoreDialogComponent } from './score/scoreDialog.component';
import { ScoreScreenComponent } from './score/scoreScreen.component';

@NgModule({
  declarations: [
    ScriptureSelectorComponent,
    RandomScriptureComponent,
    ScripturesAppComponent,
    ScoreDialogComponent,
    ScoreScreenComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
  ],
})
export class ScripturesAppModule {}
