import { Recipe } from "src/app/recipe/shared/stores/models/recipe.model";
import { Injectable } from "@angular/core";
import { Ingredient } from "src/app/recipe/shared/stores/models/ingredient.model";
import { ShoppingListService } from "src/app/shopping-list/shared/services/shopping-list.service";
import { Subject } from "rxjs";
import { Store } from "@ngrx/store";
import * as ShoppingListAction from '../../shopping-list/store/shopping-list.action';
@Injectable()
export class RecipeService{
  recipeChanged=new Subject<Recipe[]>();

  constructor(private shoppingService:ShoppingListService,private store:Store<{shoppingList:{ingredients:Ingredient[]}}>){}

  private  recipes:Recipe[] = [
    // new Recipe("Recipe1","recipe Description","https://images.media-allrecipes.com/images/54831.jpg",[new Ingredient("Tomato",3),new Ingredient("onion",3)]),
    // new Recipe("Recipe2","recipe Description2","https://images.media-allrecipes.com/userphotos/300x300/3374022.jpg",[new Ingredient("Potato",6)])
  ];

    getRecipeList(){
        return this.recipes.slice();
    }

    addIngredientToShoppingList(ingredients:Ingredient[]){
     //this.shoppingService.addIngredientFromRecipe(ingredients);
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