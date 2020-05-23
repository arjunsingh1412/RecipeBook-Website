import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/services/data-storage.service';
import { AuthenticationService } from '../auth/services/auth-service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {

  constructor(private dataStorageService:DataStorageService,private authService:AuthenticationService,private router:Router) { }
  collapsed = true;
  private userSubscription:Subscription;
  isAuthenticated:boolean=false;
  
  ngOnInit() {
    this.userSubscription=this.authService.userData.subscribe(
      user=>{
        this.isAuthenticated=!!user;
      });
  }
  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }

  onSaveRecipeData(){
    this.dataStorageService.saveRecipeData();
  }
  onFetchRecipeData(){
    this.dataStorageService.getRecipeData();
  }

  onLogOut(){
  this.authService.onLogout();
  }
  onLogIn(){
    this.router.navigate(['/auth']);
  }

}
