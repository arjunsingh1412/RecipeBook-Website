import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./shared/stores/models/recipe.model";
import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import * as fromApp from '../store/app.reducer';
import * as RecipeAction from '../recipe/store/recipe.actions';
import { Actions,Effect, ofType } from "@ngrx/effects";
import { take, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({providedIn:'root'})
export class RecipeResolverService implements Resolve<Recipe[]>{
    constructor( private store:Store<fromApp.AppState>,
        private actions$:Actions){}
    resolve(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        
     return this.store.select('recipes').pipe(
         take(1),
            map(recipeState=>{
                return recipeState.recipes;
            }),
            switchMap(recipes=>{
                if(recipes.length == 0){
                    this.store.dispatch(new RecipeAction.FetchRecipes());
                    return this.actions$.pipe(
                        ofType(RecipeAction.SET_RECIPES),
                        take(1)
                    );
                }else{
                    return of(recipes);
                }
            })
        )


    }
}