import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {throwError, BehaviorSubject} from "rxjs";
import { User } from "src/app/shared/models/user.model";
import { Router } from "@angular/router";
import {environment} from'../../../environments/environment';

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

    constructor(private http:HttpClient,private router:Router){}

    userData=new BehaviorSubject<User>(null);

    tokenExpirationTimer:any;

    autoLogin(){
        const userInfo:{
            email:string,
            id:string,
            _token:string,
            _tokenExpirationDate:string
        }= JSON.parse(localStorage.getItem('userInfo'));
        if(!userInfo){
            return;
        }
        const loadedUser = new User(userInfo.email,userInfo.id,userInfo._token,new Date(userInfo._tokenExpirationDate));

        if(loadedUser.token){
            const tokenExpiryDuration= new Date(userInfo._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(tokenExpiryDuration);
            this.userData.next(loadedUser);
        }
    }

    autoLogout(expirationDuration:number){
      this.tokenExpirationTimer=  setTimeout(()=>{
            this.onLogout();
        },expirationDuration)
    }

    onSignUp(email:string,password:string){
       return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseAPIKey,
        {
            email:email,
            password:password,
            returnSecureToken:true
        }).pipe(catchError(this.handleError),tap(response=>{
            this.handleUserAuthentication(response);
        }));
    }

    onLogin(email:string,password:string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseAPIKey,
        {
            email:email,
            password:password,
            returnSecureToken:true
        }).pipe(catchError(this.handleError),tap(respone=>{
            this.handleUserAuthentication(respone);
        }));
    }

    onLogout(){
        this.userData.next(null);
        localStorage.removeItem('userInfo');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer=null;
        this.router.navigate(['/auth']);
    }

    private handleUserAuthentication(authRes:AuthResponseData){

        const email=authRes.email;
        const id=authRes.localId;
        const token=authRes.idToken;
        const expirationIn=authRes.expiresIn;
        const expirationDate= new Date(
            new Date().getTime() + expirationIn * 1000
        );

        const user=new User(
            email,
            id,
            token,
            expirationDate
        );
            this.userData.next(user);
            this.autoLogout(expirationIn * 1000)
            localStorage.setItem('userInfo',JSON.stringify(user));
    }

    private handleError(errorRes:HttpErrorResponse){
        let errorMessage="An error Occured in processing the request";
        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
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
          return throwError(errorMessage);
    }

}