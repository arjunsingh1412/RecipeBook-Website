import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core-module';
import { SharedModule } from './shared/shared.module';
import {StoreModule} from '@ngrx/store';
import { ShoppingListReducers } from './shopping-list/store/shopping-list.reducers';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({shoppingList:ShoppingListReducers}),
    CoreModule,
    SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
