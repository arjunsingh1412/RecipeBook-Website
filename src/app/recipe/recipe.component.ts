import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/services/data-storage.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  constructor(private dataStorageService:DataStorageService) { }

  ngOnInit() {
    this.dataStorageService.getRecipeData();
  }

}
