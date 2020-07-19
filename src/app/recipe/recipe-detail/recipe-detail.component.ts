import { Component, OnInit } from '@angular/core';
import { Recipe } from '../shared/stores/models/recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';
import * as RecipeAction from '../store/recipe.actions';
import * as ShoppingListAction from '../../shopping-list/store/shopping-list.action';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  recipeId: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params.pipe(
      map((param: Params) => {
        return +param['id'];
      }), switchMap(id => {
        this.recipeId = id;
        return this.store.select('recipes');
      }),
      map(recipeState => {
        return recipeState.recipes.find((recipe, index) => {
          return index === this.recipeId;
        });
      })).subscribe(recipe => {
        this.recipe = recipe;
      });
  }
    
  sendIngredientToShoppingList() {
    this.store.dispatch(new ShoppingListAction.AddIngredients(this.recipe.ingredients))
  }
  onRecipeEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  onRecipeDelete() {
    this.store.dispatch(new RecipeAction.DeleteRecipe(this.recipeId));
    this.router.navigate(['/recipes']);
  }

}
