import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../recipe/shared/stores/models/ingredient.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListAction from '../shopping-list/store/shopping-list.action';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<fromApp.AppState>
  ) { }
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }
  ngOnDestroy() {
  }
  onEditItem(index: number) {
    //this.shoppingListService.startEditingItem.next(index);
    this.store.dispatch(new ShoppingListAction.StartEdit(index));
  }
}
