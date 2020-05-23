import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../recipe/shared/stores/models/ingredient.model';
import { ShoppingListService } from './shared/services/shopping-list.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit,OnDestroy {

  constructor(
    private shoppingListService:ShoppingListService,
    private store:Store<{shoppingList:{ingredients:Ingredient[]}}>
    ) { }
  ingredients:Observable<{ingredients:Ingredient[]}>;

  ngOnInit() {
    this.ingredients=this.store.select('shoppingList');
  }
  ngOnDestroy(){
  }
  onEditItem(index:number){
    this.shoppingListService.startEditingItem.next(index);
  }
}
