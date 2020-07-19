import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../shared/stores/models/recipe.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  recipes: Recipe[];
  subscription: Subscription;
  ngOnInit() {
    this.subscription = this.store.select('recipes')
      .pipe(map(recipeState => recipeState.recipes))
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        });
  }
  onAddNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
