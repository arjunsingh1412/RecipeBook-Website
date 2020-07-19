import * as fromShoppingList from '../shopping-list/store/shopping-list.reducers';
import * as fromAuth from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';
import * as fromRecipe from '../recipe/store/recipe.reducer';

export interface AppState {
    shoppingList: fromShoppingList.State;
    auth: fromAuth.State;
    recipes:fromRecipe.State;
}

export const appReducer:ActionReducerMap<AppState>={
    shoppingList:fromShoppingList.ShoppingListReducers,
    auth:fromAuth.AuthReducer,
    recipes:fromRecipe.recipeReducer
}