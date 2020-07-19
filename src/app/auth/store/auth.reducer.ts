import { User } from "src/app/shared/models/user.model";
import * as fromAuth from "./auth.actions";

export interface State{
    user:User;
    authError:string;
    loading:boolean;
}
const initialState:State={
    user:null,
    authError:null,
    loading:false
}

export function AuthReducer(state=initialState,action:fromAuth.AuthActions){

    switch(action.type){
        case fromAuth.AUTHENTICATE_SUCCESS:
            const userInfo=new User(
                action.payload.email,
                action.payload.id,
                action.payload.token,
                action.payload.tokenExpirationDate
            );
            return{
                ...state,
                authError:null,
                user:userInfo,
                loading:false
            }
        case fromAuth.LOGOUT:
            return{
                ...state,
                authError:null,
                user:null
            }
        case fromAuth.LOGIN_START:
                return{
                    ...state,
                    authError:null,
                    loading:true

                }
        case fromAuth.AUTHENTICATE_FAIL:
            return{
                ...state,
                authError:action.payload,
                user:null,
                loading:false
            }
        case fromAuth.CLEAR_ERROR:
            return{
                ...state,
                authError:null
            };
        default:
            return state;
    }
}