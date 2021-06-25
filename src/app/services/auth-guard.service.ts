import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { GlobalService } from './global.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, OnDestroy {
  currentUser: any;

  constructor(private router: Router,
              private globalService: GlobalService,
              private authService: AuthService) {
              }

    ngOnDestroy() {
      // this.authSubscription.unsubscribe();
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
        if (this.currentUser === null) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    }
}