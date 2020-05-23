import { NgModule } from "@angular/core";
import { ShoppingListService } from "./shopping-list/shared/services/shopping-list.service";
import { RecipeService } from "./shared/services/recipe.service";
import { DataStorageService } from "./shared/services/data-storage.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthenticationInterceptor } from "./auth/services/auth-service.interceptor";

@NgModule({
    providers:[
        ShoppingListService,
        RecipeService,
        DataStorageService,
        {
          provide:HTTP_INTERCEPTORS,
          useClass:AuthenticationInterceptor,
          multi:true
        }
    ]
})
export class CoreModule{}