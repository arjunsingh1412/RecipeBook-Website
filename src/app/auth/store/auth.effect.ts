import {Actions, ofType, Effect} from '@ngrx/effects';
import * as AuthActions from '../store/auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, using } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { AuthenticationService } from '../services/auth-service';

export interface AuthResponseData{
    idToken: string;     //	A Firebase Auth ID token for the newly created user.
    email: string;           //	Since the user is anonymous, this should be empty.
    refreshToken: string; //	A Firebase Auth refresh token for the newly created user.
    expiresIn: number;     //	The number of seconds in which the ID token expires.
    localId: string;         //  The uid of the newly created user
    registered?:boolean;    //	Whether the email is for an existing account.
}

const handleAuthentication= (expiresIn:number,email:string,userId:string,token:string)=>{
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email,userId,token,expirationDate);
    localStorage.setItem('userInfo',JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess(
        { email: email, 
            id: userId, 
            token: token, 
            tokenExpirationDate: expirationDate,
            redirect:true });
};

const handleError=(errorRes:any)=>{
    let errorMessage="An error Occured in processing the request";
    if(!errorRes.error || !errorRes.error.error){
        return of(new AuthActions.AuthenticationFailed(errorMessage));
    }
    switch(errorRes.error.error.message){
        case "EMAIL_EXISTS":
          errorMessage="Email already exist please try with other email.";
          break;
        case "EMAIL_NOT_FOUND":
            errorMessage ="There is no user record corresponding to this identifier. The user may have been deleted.";
            break;
        case "INVALID_PASSWORD":
            errorMessage ="The password is invalid or the user does not have a password.";
            break;
        case "USER_DISABLED":
            errorMessage ="The user account has been disabled by an administrator.";
            break;
      }
        return of(new AuthActions.AuthenticationFailed(errorMessage));
};

@Injectable()
export class AuthEffects{

    @Effect()
    authSignUp=this.action$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signUpAction:AuthActions.SignUpStart)=>{
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseAPIKey,
            {
                email:signUpAction.payload.email,
                password:signUpAction.payload.password,
                returnSecureToken:true
            }
        ).pipe(
            tap(resData=>{
                this.authService.setLogoutTimer(resData.expiresIn * 1000);
            }),
            map(resData=>{
             return handleAuthentication(resData.expiresIn,resData.email,resData.localId,resData.idToken);
            }),
            catchError(errorRes=>{
                return handleError(errorRes);
            })
        )
        })
    )


    @Effect()
    authLogin = this.action$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
                + environment.fireBaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                })
                .pipe(
                    tap(resData=>{
                        this.authService.setLogoutTimer(resData.expiresIn * 1000);
                    }),
                    map(resData => {
                        return handleAuthentication(resData.expiresIn, resData.email, resData.localId, resData.idToken);
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    })
                );
        })
    );

    @Effect({dispatch:false})
    authRedirect=this.action$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccess:AuthActions.AuthenticateSuccess)=>{
            if(authSuccess.payload.redirect){
                this.router.navigate(['/']);
            }
        })
    );

    @Effect({dispatch:false})
    authLogout=this.action$.pipe(
        ofType(AuthActions.LOGOUT),tap(()=>{
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userInfo');
            this.router.navigate(['/auth']);
        })
    );

    @Effect()
    autoLogin=this.action$.pipe(
        ofType(AuthActions.AUTO_LOGIN),map(()=>{
            const userInfo:{
                email:string,
                id:string,
                _token:string,
                _tokenExpirationDate:string
            }= JSON.parse(localStorage.getItem('userInfo'));
            if(!userInfo){
                return { type: 'DUMMY'}
            }
            const loadedUser = new User(userInfo.email,userInfo.id,userInfo._token,new Date(userInfo._tokenExpirationDate));
    
            if(loadedUser.token){
                const tokenExpiryDuration= new Date(userInfo._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(tokenExpiryDuration);
               return new AuthActions.AuthenticateSuccess({
                    email:loadedUser.email,
                    id:loadedUser.id,
                    token:loadedUser.token,
                    tokenExpirationDate:new Date(userInfo._tokenExpirationDate),
                    redirect:false
                });
            }
            return { type: 'DUMMY'}
        })
    );

    constructor(private action$:Actions,private http:HttpClient,private router:Router,private authService:AuthenticationService){}
}