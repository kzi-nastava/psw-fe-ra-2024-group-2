import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  showProfile(): void {
    this.router.navigate(['/profile']);
  }

  showMyTours(): void{
    this.router.navigate(['/mytours'])
  }

  showAllTours(): void{
    this.router.navigate(['/alltours'])
  }

  showReviews(): void{
    this.router.navigate(['/reviews'])
  }

  showAddNewTour(): void{
    this.router.navigate(['/addNewTour'])
  }

  showMyClub(): void {
    this.router.navigate(['/myclub']);
  }

  showClub(): void{
    this.router.navigate(['/club'])
  }

  showObjects(): void{
    this.router.navigate(['/objects'])
  }
  showObjectsForUpdate(): void{
    this.router.navigate(['/objectsTable'])
  }


  showComment(): void{
    this.router.navigate(['/comment'])

  }
}
