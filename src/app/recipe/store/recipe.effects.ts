import {Actions, Effect, ofType } from "@ngrx/effects";
import * as RecipeAction from './recipe.actions';
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../shared/stores/models/recipe.model";
import { Injectable } from "@angular/core";
import * as fromApp from '../../store/app.reducer';
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects{

    @Effect()
    fetchRecipes=this.actions$.pipe(
        ofType(RecipeAction.FETCH_RECIPES),
        switchMap(()=>{
          return  this.http.get<Recipe[]>('https://recipebook-b1157.firebaseio.com/recipes.json')
        }),
        map(recipes=>{
            return recipes.map(recipe=>{
                return{
                    ...recipe,
                    ingredients:recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        map(recipes=>{
            return new RecipeAction.SetRecipes(recipes);
        })
    );

    @Effect()
    storeRecipes = this.actions$.pipe(
        ofType(RecipeAction.STORE_RECIPE),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData,RecipeState])=>{
            return this.http.put('https://recipebook-b1157.firebaseio.com/recipes.json', RecipeState.recipes)
        })
    );
    
    constructor(private actions$:Actions,private http: HttpClient,private store:Store<fromApp.AppState>){}
}