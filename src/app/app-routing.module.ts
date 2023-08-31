import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { ScripturesAppComponent } from "./scripturesApp/scripturesApp.component";
import { WorkSelectorComponent } from "./scripturesApp/workSelector/workSelector.component";
import { ScoreScreenComponent } from "./scripturesApp/score/scoreScreen.component";

const routes: Routes = [
  { path: '', component: WorkSelectorComponent},
  { path: 'scripture', component: ScripturesAppComponent},
  { path: 'score', component: ScoreScreenComponent},
  { path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
