import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from "@angular/common/http";
import { AuthenticationService } from "./auth-service";
import { take, exhaustMap } from "rxjs/operators";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor{

    constructor(private authService:AuthenticationService){}

    intercept(req:HttpRequest<any>,next:HttpHandler){
        return this.authService.userData.pipe(
            take(1),
            exhaustMap(user=>{
                if(!user){
                    return next.handle(req);
                }

                const modifiedRequest=req.clone({
                    params:new HttpParams().set('auth',user.token)
                });
                return next.handle(modifiedRequest);
            })
        );        
    }
}