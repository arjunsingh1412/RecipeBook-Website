import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from '../../store/app.reducer';
import * as AuthAction from '../store/auth.actions';
export interface AuthResponseData{
    idToken: string;     //	A Firebase Auth ID token for the newly created user.
    email: string;           //	Since the user is anonymous, this should be empty.
    refreshToken: string; //	A Firebase Auth refresh token for the newly created user.
    expiresIn: number;     //	The number of seconds in which the ID token expires.
    localId: string;         //  The uid of the newly created user
    registered?:boolean;    //	Whether the email is for an existing account.
}

@Injectable({'providedIn':'root'})
export class AuthenticationService{

    constructor(
        private store:Store<fromApp.AppState>
    ){}

    //userData=new BehaviorSubject<User>(null);

    tokenExpirationTimer:any;

    setLogoutTimer(expirationDuration:number){
      this.tokenExpirationTimer=  setTimeout(()=>{
           this.store.dispatch(new AuthAction.Logout())
        },expirationDuration)
    }

    clearLogoutTimer(){
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer=null;
        }
    }

}