import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdministrationService } from '../../administration/administration.service';
import { Account } from '../../administration/model/account.model';
import { Wallet } from '../model/wallet.model';

@Component({
  selector: 'xp-manage-tourist-funds',
  templateUrl: './manage-tourist-funds.component.html',
  styleUrls: ['./manage-tourist-funds.component.css']
})
export class ManageTouristFundsComponent implements OnInit {
  account: Account[] = [];
  user: any;
  walletBalances: { [userId: number]: number } = {}; // mapa userId -> balans

  constructor(
    private service: AdministrationService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAccounts();
    this.authService.user$.subscribe((user) => {
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

  getAccounts(): void {
    this.service.getAccount().subscribe({
      next: (result) => {
        this.account = result.results;
        this.loadWalletBalances();
      },
      error: (err: any) => {
        console.error('Error fetching accounts:', err);
      }
    });
  }

  loadWalletBalances(): void {
    this.account.forEach((acc) => {
      if (acc.role === 2) {
        this.service.getWalletBalance(acc.userId).subscribe({
          next: (wallet: Wallet) => {
            console.log('Wallet response for user', acc.userId, wallet);
            this.walletBalances[acc.userId] = wallet.adventureCoinsBalance; 
          },
          error: (err) => {
            console.error(`Error fetching wallet balance for user ${acc.userId}:`, err);
            this.walletBalances[acc.userId] = 0; // 0 u slucaju greske
          }
        });
      }
    });
  }  

  addFunds(account: Account): void {
    const amount = prompt(`Enter the amount of funds to add for ${account.username}:`);
    if (amount) {
      const parsedAmount = Number(amount); // Pretvori string u broj
      if (isNaN(parsedAmount) || parsedAmount <= 0 || !Number.isInteger(parsedAmount)) {
        alert('Invalid amount. Please enter a positive whole number.');
        return;
      }
  
      this.service.addFunds(account.userId, parsedAmount).subscribe({
        next: () => {
          this.snackBar.open(`Successfully added ${parsedAmount} AC to ${account.username}.`, 'Close', { duration: 3000 });
          this.walletBalances[account.userId] += parsedAmount; 
        },
        error: (err) => {
          console.error('Error adding funds:', err);
          this.snackBar.open('Failed to add funds. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }
  
}
