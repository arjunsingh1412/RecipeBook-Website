import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../shared/stores/models/recipe.model';
import { RecipeService } from 'src/app/shared/services/recipe.service';
import {  Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit,OnDestroy {

  constructor(private recipeService:RecipeService,private route:ActivatedRoute,private router:Router) { }

  recipes:Recipe[];
  subscription:Subscription;
  ngOnInit() {
   this.subscription= this.recipeService.recipeChanged.subscribe(
      (recipes:Recipe[])=>{
        this.recipes=recipes;
      });
    this.recipes=this.recipeService.getRecipeList();
  }
  onAddNewRecipe(){
    this.router.navigate(['new'],{relativeTo:this.route});
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
