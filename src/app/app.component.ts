import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './auth/services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'RecipeBookWebsite';
  constructor(private authService:AuthenticationService){}

  ngOnInit(){
    this.authService.autoLogin();
  }
}
