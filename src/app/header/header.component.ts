import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeAction from '../recipe/store/recipe.actions';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {

  constructor(
    private router:Router,
    private store:Store<fromApp.AppState>) { }
  collapsed = true;
  private userSubscription:Subscription;
  isAuthenticated:boolean=false;
  
  ngOnInit() {
    this.userSubscription=this.store.select('auth').pipe(
      map(authState=>{
        return authState.user
      })).subscribe(
      user=>{
        this.isAuthenticated=!!user;
      });
  }
  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }

  onSaveRecipeData(){
    this.store.dispatch(new RecipeAction.StoreRecipes());
  }
  onFetchRecipeData(){
    this.store.dispatch(new RecipeAction.FetchRecipes());
  }

  onLogOut(){
  this.store.dispatch(new AuthActions.Logout());
  }
  onLogIn(){
    this.router.navigate(['/auth']);
  }

}
