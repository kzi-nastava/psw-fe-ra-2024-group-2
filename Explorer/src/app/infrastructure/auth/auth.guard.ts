import { Injectable } from '@angular/core';
import {
  UrlTree,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from './model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
              
      const currentPath = route.url.map(segment => segment.path).join('/');
      console.log("rout: " + currentPath);
    
    const user: User = this.authService.user$.getValue();
    if (user.username === '') {
      this.router.navigate(['login']);
      return false;
    }

    if (currentPath === "guide-tours" && user.role != 'author'){
      this.router.navigate(['home']);
      return false;
    }

    if (currentPath === "tourist-tours" && user.role != 'tourist'){
      this.router.navigate(['home']);
      return false;
    }

    console.log("route: " + this.router.url);
    return true;
  }

}
