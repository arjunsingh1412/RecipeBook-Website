import { Ingredient } from "../../recipe/shared/stores/models/ingredient.model";
import * as ShoppingListAction from './shopping-list.action';

const initialState={
    ingredients: [
        new Ingredient("Tomato", 5),
        new Ingredient("potato", 4)
    ]
};
export function ShoppingListReducers(state=initialState,action:ShoppingListAction.AddIngredients){
    switch(action.type){
        case ShoppingListAction.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients:[...state.ingredients,action.payload]
            };
        default:
            return state;
    }

}