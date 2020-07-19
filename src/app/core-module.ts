import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthenticationInterceptor } from "./auth/services/auth-service.interceptor";

@NgModule({
    providers:[
        {
          provide:HTTP_INTERCEPTORS,
          useClass:AuthenticationInterceptor,
          multi:true
        }
    ]
})
export class CoreModule{}