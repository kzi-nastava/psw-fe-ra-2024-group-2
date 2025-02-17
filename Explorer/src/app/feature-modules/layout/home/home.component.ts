import { Component } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
      private authService: AuthService,
  ) {
    this.test();
  }

  test(): void {

    //var user$ = this.authService.user$;
    console.log('Current User (getValue):' + this.authService.getUser());

    this.authService.test().subscribe({
      next: (response) => {
        console.log(response); // Print the response here in the console
        //this.router.navigate(['/']); // Navigate to the home page after success (if needed)
      },
      error: (error) => {
        console.error('Error occurred:', error); // Log any errors here
      }
    });
  }
  
}
