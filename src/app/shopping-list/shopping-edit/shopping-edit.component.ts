import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { Ingredient } from 'src/app/recipe/shared/stores/models/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListAction from '../../shopping-list/store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {

  @ViewChild('f') form:NgForm;

  subscription:Subscription;
  editMode:boolean=false;
  editedItemIndex:number;
  editedItem:Ingredient;

  constructor(private store:Store<fromApp.AppState>) { }

  ngOnInit() {
   this.subscription= this.store.select('shoppingList').subscribe(stateData=>{
      if(stateData.editedIngredientIndex != -1){
        this.editMode=true;
        this.editedItem=stateData.editedIngredient;
        this.editedItemIndex=stateData.editedIngredientIndex;
        this.form.setValue({
          name:this.editedItem.name,
          amount:this.editedItem.amount
        });
      }else{
        this.editMode=false;
      }
    });
  }

  onAddItem(form: NgForm) {
    let formValue = form.value;
    const ingredient = new Ingredient(formValue.name, formValue.amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListAction.UpdateIngredient(
        {
          index: this.editedItemIndex, ingredient: ingredient
        }))
    } else {
      this.store.dispatch(new ShoppingListAction.AddIngredient(ingredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear(){
    this.editMode=false;
    this.form.reset();
    this.store.dispatch(new ShoppingListAction.StopEdit());
  }

  onDelete(){
    this.store.dispatch(new ShoppingListAction.DeleteIngredient(this.editedItemIndex));
    this.editMode=false;
    this.form.reset();
  }

  ngOnDestroy(){
    if(this.subscription)
      this.subscription.unsubscribe();

    this.store.dispatch(new ShoppingListAction.StopEdit());
  }

}
