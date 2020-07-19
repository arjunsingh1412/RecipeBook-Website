import { Recipe } from "src/app/recipe/shared/stores/models/recipe.model";
import { Injectable } from "@angular/core";
import { Ingredient } from "src/app/recipe/shared/stores/models/ingredient.model";
import { Subject } from "rxjs";
import { Store } from "@ngrx/store";
import * as ShoppingListAction from '../../shopping-list/store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';
@Injectable()
export class RecipeService{
  recipeChanged=new Subject<Recipe[]>();

  constructor(private store:Store<fromApp.AppState>){}

  private  recipes:Recipe[] = [];

    getRecipeList(){
        return this.recipes.slice();
    }

    addIngredientToShoppingList(ingredients:Ingredient[]){
     this.store.dispatch(new ShoppingListAction.AddIngredients(ingredients));
    }

    getRecipeByNumber(index:number){
      return this.recipes[index];
    }
    addRecipe(newRecipe:Recipe){
      this.recipes.push(newRecipe);
      this.recipeChanged.next(this.recipes.slice());
    }
    updateRecipe(index:number, newRecipe:Recipe){
      this.recipes[index]=newRecipe;
      this.recipeChanged.next(this.recipes.slice());
    }
    deleteRecipe(index:number){
      this.recipes.splice(index,1);
      this.recipeChanged.next(this.recipes.slice());
    }
    setRecipeData(recipe:Recipe[]){
      this.recipes=recipe;
      this.recipeChanged.next(this.recipes.slice());
    }
}