import { NgModule } from "@angular/core";
import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthGuard } from "../auth/services/auth-guard";

@NgModule({
    declarations: [ShoppingListComponent, ShoppingEditComponent],
    imports: [CommonModule,
        FormsModule,
        RouterModule.forChild(
            [
                { path: '', component: ShoppingListComponent,canActivate:[AuthGuard] }
            ])
        ],
        exports:[RouterModule]
})
export class ShoppingListModule{

}