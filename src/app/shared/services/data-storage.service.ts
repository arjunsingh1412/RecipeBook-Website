import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from "./recipe.service";
import { Recipe } from "src/app/recipe/shared/stores/models/recipe.model";

@Injectable()
export class DataStorageService {

    constructor(private http: HttpClient, private recipeService: RecipeService) { }

    saveRecipeData() {
        const recipes = this.recipeService.getRecipeList();
        this.http.put('https://recipebook-b1157.firebaseio.com/recipes.json', recipes).subscribe(
            (response) => {
                console.log(response);
            });
    }

    getRecipeData() {
        this.http.get<Recipe[]>('https://recipebook-b1157.firebaseio.com/recipes.json')
        .subscribe(
                (recipe) => {
                    this.recipeService.setRecipeData(recipe);
                });
    }
}