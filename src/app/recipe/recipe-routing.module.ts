import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RecipeComponent } from "./recipe.component";
import { AuthGuard } from "../auth/services/auth-guard";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeResolverService } from "./recipe-resolver.service";
const routes:Routes=[
    {
    path: '', component: RecipeComponent,
    canActivate:[AuthGuard], 
    children: [
      { path: '', component: RecipeStartComponent,resolve:[RecipeResolverService] },
      { path: 'new', component: RecipeEditComponent },
      { path: ':id', component: RecipeDetailComponent ,resolve:[RecipeResolverService]},
      { path: ':id/edit', component: RecipeEditComponent,resolve:[RecipeResolverService] }]
    }
];
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class RecipeRoutingModule{

}