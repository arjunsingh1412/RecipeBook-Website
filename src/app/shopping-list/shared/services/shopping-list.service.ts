import { Ingredient } from "src/app/recipe/shared/stores/models/ingredient.model";
import { Subject } from "rxjs";

export class ShoppingListService {
ingredientChanged=new Subject<Ingredient[]>();
startEditingItem=new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient("Tomato", 5),
        new Ingredient("potato", 4)
    ];

    getIngredients() {
        return this.ingredients.slice();
    }
    getIngredient(index:number){
        return this.ingredients[index];
    }

    addIngredients(ingredient:Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientChanged.next(this.ingredients.slice());
    }

    addIngredientFromRecipe(ingredient:Ingredient[]){
        this.ingredients.push(...ingredient);
        this.ingredientChanged.next(this.ingredients.slice());
    }
    updateIngredient(index:number,newIngredient:Ingredient){
        this.ingredients[index]=newIngredient;
        this.ingredientChanged.next(this.ingredients.slice());
    }
    deleteIngredient(index:number){
        this.ingredients.splice(index,1);
        this.ingredientChanged.next(this.ingredients.slice());
    }
}