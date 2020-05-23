import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { Ingredient } from 'src/app/recipe/shared/stores/models/ingredient.model';
import { ShoppingListService } from '../shared/services/shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

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

  constructor(private shoppingListService:ShoppingListService) { }

  ngOnInit() {
    this.shoppingListService.startEditingItem.subscribe(
      (index:number)=>{
        this.editedItemIndex=index;
        this.editMode=true;
        this.editedItem=this.shoppingListService.getIngredient(index);
        this.form.setValue({
          name:this.editedItem.name,
          amount:this.editedItem.amount
        });
      });
  }

  onAddItem(form:NgForm){
    let formValue=form.value;
    const ingredient= new Ingredient(formValue.name,formValue.amount);
    if(this.editMode){
      this.shoppingListService.updateIngredient(this.editedItemIndex,ingredient);
    }else{
    this.shoppingListService.addIngredients(ingredient);
    }
    this.editMode=false;
    form.reset();
  }

  onClear(){
    this.editMode=false;
    this.form.reset();
  }

  onDelete(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.editMode=false;
    this.form.reset();
  }

  ngOnDestroy(){
    if(this.subscription)
      this.subscription.unsubscribe();
  }

}
