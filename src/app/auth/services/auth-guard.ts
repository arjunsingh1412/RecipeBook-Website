import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationService } from "./auth-service";
import { map, tap, take } from "rxjs/operators";
@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate{

    constructor(private authService:AuthenticationService,private router:Router){}

    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean{
        return this.authService.userData.pipe(
            take(1),
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