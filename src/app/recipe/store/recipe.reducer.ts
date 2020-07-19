import { Recipe } from "../shared/stores/models/recipe.model";
import * as RecipeActions from './recipe.actions';

export interface State {
    recipes: Recipe[];
}
const initialState: State = {
    recipes: []
};

export function recipeReducer(state = initialState, action: RecipeActions.RecipesAction) {
    switch (action.type) {
        case RecipeActions.SET_RECIPES:
            return {
                ...state,
                recipes:[...action.payload]
            };
        case RecipeActions.ADD_RECIPE:
            return{
                ...state,
                recipes:[...state.recipes,action.payload]
            };
        case RecipeActions.UPDATE_RECIPE:
            const UpdatedRecipe={
                ...state.recipes[action.payload.index],
                ...action.payload.newRecipe
            };
            const UpdatedRecipes=[...state.recipes];
            UpdatedRecipes[action.payload.index]=UpdatedRecipe;
            return{
                ...state,
                recipes:UpdatedRecipes
            };
        case RecipeActions.DELETE_RECIPE:
            return{
                ...state,
                recipes:state.recipes.filter((recipe,index)=>{
                    return index != action.payload;
                })
            };
        default:
            return state;
    }
}