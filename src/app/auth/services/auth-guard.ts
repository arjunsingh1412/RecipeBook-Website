import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationService } from "./auth-service";
import { map, tap, take } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as fromApp from '../../store/app.reducer';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate{

    constructor(private authService:AuthenticationService,private router:Router,private store:Store<fromApp.AppState>){}

    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean{
        return this.store.select('auth').pipe(
            take(1),
            map(authState=>{
                return authState.user
            }),
            map(user=>{
            const isAuth= !!user;
            return !!user;
        }),tap(isAuth=>{
            if(!isAuth){
                this.router.navigate(['/auth']);
            }
        }));
    }
}