import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../../shared/stores/models/recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss']
})
export class RecipeItemComponent implements OnInit {

  @Input() recipe:Recipe;
  @Input() recipeIndex:number;

  constructor() { }

  ngOnInit() {
  }
}
