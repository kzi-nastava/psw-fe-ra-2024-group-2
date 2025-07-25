import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenStorage } from './jwt/token.service';
import { environment } from 'src/env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from './model/login.model';
import { AuthenticationResponse } from './model/authentication-response.model';
import { User } from './model/user.model';
import { Registration } from './model/registration.model';
import { Wallet } from './model/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<User>({username: "", id: 0, role: "",  bonusPoints: 0 });


  constructor(private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router) { }

  login(login: Login): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(environment.apiHost + 'users/login', login)
      .pipe(
        tap((authenticationResponse) => {
          this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
          this.setUser();
        })
      );
  }

  register(registration: Registration): Observable<AuthenticationResponse> {
    console.log("registration: " + registration);

    return this.http
    .post<AuthenticationResponse>(environment.apiHost + 'users', registration)
    .pipe(
      tap((authenticationResponse) => {
        this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
        this.setUser();
      })
    );
  }

  logout(): void {
    this.router.navigate(['/home']).then(_ => {
      this.tokenStorage.clear();
      this.user$.next({username: "", id: 0, role: "" });
      }
    );
  }

  getWallet(): Observable<Wallet> {

    return this.http
      .get<Wallet>(`${environment.apiHost}GetWallet/${this.getUserId()}`)
      .pipe(
        tap((wallet) => {
          console.log('Wallet data:', wallet);
        })
      );
  }
  

  checkIfUserExists(): void {
    const accessToken = this.tokenStorage.getAccessToken();
    if (accessToken == null) {
      return;
    }
    this.setUser();
  }

  private setUser(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const user: User = {
      id: +jwtHelperService.decodeToken(accessToken).id,
      username: jwtHelperService.decodeToken(accessToken).username,
      role: jwtHelperService.decodeToken(accessToken)[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ],
      bonusPoints: jwtHelperService.decodeToken(accessToken).bonusPoints
    };
    
    console.log("user interest: " + jwtHelperService.decodeToken(accessToken).interests);
    this.user$.next(user);
  }

  getUser(): string {
    const currentUser = this.user$.getValue();
    return `ID: ${currentUser.id}, Username: ${currentUser.username}, Role: ${currentUser.role}, Bonus Points: ${currentUser.bonusPoints}`;
  }

  getUserId(): number {
    const currentUser = this.user$.getValue();
    return currentUser.id;
  }

  getUserRole(): string {
    const currentUser = this.user$.getValue();
    return currentUser.role;
  }

  getBonusPoints(): number {
    const currentUser = this.user$.getValue();
    return currentUser.bonusPoints || 0;
  }

  test(): Observable<string> {
    return this.http.get<string>(environment.apiHost + 'tour/test').pipe(
      tap((response) => {
        // This is where you can handle the response if needed, for now, we just return it.
        console.log(response); // Log the response for debugging or testing purposes
      })
    );
  }
  
}
