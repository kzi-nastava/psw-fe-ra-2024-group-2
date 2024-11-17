import { Component, OnInit } from '@angular/core';
import { Account } from '../model/account.model';
import { AdministrationService } from '../administration.service';
import { PagedResult } from '../../tour-authoring/shared/model/tour.module';
import { AuthService } from '../../../infrastructure/auth/auth.service';

@Component({
  selector: 'xp-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {
  account: Account[] = [];
  user: any;

  constructor(private service: AdministrationService, private authService: AuthService){ }
  
  ngOnInit(): void {
    this.getAccounts();
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  getRoleName(role: number): string {
    switch (role) {
      case 0:
        return 'Administrator';
      case 1:
        return 'Author';
      case 2:
        return 'Tourist';
      default:
        return 'Unknown';
    }
  }

  blockUser(account: Account): void {

    const userToBlock = this.account.find(acc => acc.userId === account.userId);
    if (userToBlock) {
      userToBlock.isBlocked = true;

      // Pozovi servis za ažuriranje korisničkog naloga (pretpostavljam da imaš metodu za to)
      this.service.blockAccount(userToBlock).subscribe({
        next: () => {
          console.log(`User ${userToBlock.username} has been blocked.`);
          this.getAccounts(); 
        },
        error: (err: any) => {
          console.error('Error during blocking the user:', err);
        }
      });
    } else {
      console.log('User not found.');
    }
  }
  unblockUser(account: Account): void {
    const userToUnblock = this.account.find(acc => acc.userId === account.userId);
    if (userToUnblock) {
      userToUnblock.isBlocked = false;
      
      this.service.unblockAccount(userToUnblock).subscribe({
        next: () => {
          console.log(`User ${userToUnblock.username} has been unblocked.`);
          this.getAccounts();
        },
        error: (err: any) => {
          console.error('Error during unblocking the user:', err);
        }
      });
    } else {
      console.log('User not found.');
    }
  }

  getAccounts(): void{
    this.service.getAccount().subscribe({
      next: (result: PagedResult<Account>) => {
        this.account = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
