import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthAction from './store/auth.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit,OnDestroy {

  constructor(private store: Store<fromApp.AppState>) { }

  isLoginMode = true;
  error: string = null;
  isLoading:boolean=false;
  private storeSub:Subscription;

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmitForm(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthAction.LoginStart({ email: email, password: password }));
    } else {
      this.store.dispatch(new AuthAction.SignUpStart({ email: email, password: password }));
    }
    form.reset();
  }
  onHandleClose() {
    this.error = null;
    this.store.dispatch(new AuthAction.ClearError());
  }

  ngOnInit() {
  this.storeSub = this.store.select('auth').subscribe(authState => {
    this.isLoading=false;
      this.error = authState.authError;
    });
  }
  ngOnDestroy(){
    this.storeSub.unsubscribe();
  }

}
