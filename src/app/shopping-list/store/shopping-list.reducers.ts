import { Ingredient } from "../../recipe/shared/stores/models/ingredient.model";
import * as ShoppingListAction from './shopping-list.action';

export interface State {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number
}
// export interface AppState{
//     shoppingList:State
// }
const initialState: State = {
    ingredients: [new Ingredient("Tomato", 5), new Ingredient("potato", 4)],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export function ShoppingListReducers(state: State = initialState, action: ShoppingListAction.ShoppingListActions) {
    switch (action.type) {
        case ShoppingListAction.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListAction.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListAction.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[action.payload.index];
            const updatedIngredient = {
                ...action.payload.ingredient
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[action.payload.index] = updatedIngredient;
            return {
                ...state,
                ingredients: updatedIngredients
            };
        case ShoppingListAction.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ing, itemIndex) => {
                    return itemIndex != action.payload;
                })
            };
        case ShoppingListAction.START_EDIT:
            return{
                ...state,
                editedIngredientIndex:action.payload,
                editedIngredient:state.ingredients[action.payload]
            };
        case ShoppingListAction.STOP_EDIT:
            return{
                ...state,
                editedIngredient:null,
                editedIngredientIndex:-1
            };
        default:
            return state;
    }

}