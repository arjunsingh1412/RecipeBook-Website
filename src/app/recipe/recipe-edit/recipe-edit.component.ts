import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from 'src/app/shared/services/recipe.service';
import { Recipe } from '../shared/stores/models/recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';
import * as RecipeActions from '../store/recipe.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  recipeId:number;
  isEditMode:boolean=false;
  recipeForm:FormGroup;
  private storeSub:Subscription;

  get ingredientControls(){
    return (this.recipeForm.get('ingredients') as FormArray).controls
  }

  constructor(
    private route:ActivatedRoute,
    private recipeService:RecipeService,
    private router:Router,
    private store:Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params:Params)=>{
        this.recipeId=params['id'];
        this.isEditMode=this.recipeId !=null;
        this.initForm();
      }
    );
  }
  ngOnDestroy(){
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

  initForm(){
    let recipeName ='';
    let recipeImagePath ='';
    let recipeDescription ='';
    let recipeIngredients=new FormArray([]);
    if(this.isEditMode){
      const recipe:Recipe=this.recipeService.getRecipeByNumber(this.recipeId);
     this.storeSub= this.store.select('recipes').pipe(
        map(recipeState=>{
          return recipeState.recipes.find((recipe,index)=>{
            return index == this.recipeId;
          })
        })
      ).subscribe(recipe=>{
        recipeName=recipe.name;
        recipeImagePath=recipe.imagePath;
        recipeDescription=recipe.description;
        if(recipe['ingredients']){
          for(let ingredient of recipe['ingredients']){
            recipeIngredients.push(
              new FormGroup({
                'name':new FormControl(ingredient.name,Validators.required),
                'amount':new FormControl(ingredient.amount,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            );
          }
        }
      });
    }
    this.recipeForm=new FormGroup({
      'name':new FormControl(recipeName,Validators.required),
      'imagePath':new FormControl(recipeImagePath,Validators.required),
      'description':new FormControl(recipeDescription,Validators.required),
      'ingredients':recipeIngredients
    });
  }
  onSubmit(){
    if(this.isEditMode){
      this.store.dispatch( new RecipeActions.UpdateRecipe( {index: this.recipeId,newRecipe:this.recipeForm.value}));
    }else{
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
    }
    this.onCancel();
  }
  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name':new FormControl(null,Validators.required),
        'amount':new FormControl(null,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }
  onCancel(){
    this.router.navigate(['../'],{relativeTo:this.route});
  }
  onDeleteIngredient(index:number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
