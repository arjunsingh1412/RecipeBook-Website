import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService,AuthResponseData } from './services/auth-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private authService:AuthenticationService,private router:Router) { }

  isLoginMode=true;

  isLoading:boolean=false;
  error:string=null;

  onSwitchMode(){
    this.isLoginMode=!this.isLoginMode;
  }

  onSubmitForm(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading=true;
    let authObservable:Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObservable = this.authService.onLogin(email, password);
    } else {
        authObservable = this.authService.onSignUp(email, password);
    }

    authObservable.subscribe(
      response => {
        console.log(response);
        this.isLoading=false;
        this.router.navigate(['/recipes'])
      }, errorMessage => {
        this.isLoading=false;
        this.error=errorMessage;
      }
    );
    form.reset();
  }
  onHandleClose(){
    this.error=null;
  }

  ngOnInit() {
  }

}
