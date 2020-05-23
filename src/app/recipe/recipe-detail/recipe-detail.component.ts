import { Component, OnInit } from '@angular/core';
import { Recipe } from '../shared/stores/models/recipe.model';
import { RecipeService } from 'src/app/shared/services/recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  
  recipe:Recipe;
  recipeId:number;
  constructor(private recipeService:RecipeService, private route:ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (param:Params)=>{
        this.recipeId=param['id'];
        this.recipe=this.recipeService.getRecipeByNumber(this.recipeId);
      }
    );
  }
  sendIngredientToShoppingList(){
    this.recipeService.addIngredientToShoppingList(this.recipe.ingredients);
  }
  onRecipeEdit(){
    this.router.navigate(['edit'],{relativeTo:this.route});
  }
  onRecipeDelete(){
    this.recipeService.deleteRecipe(this.recipeId);
    this.router.navigate(['/recipes']);
  }

}
