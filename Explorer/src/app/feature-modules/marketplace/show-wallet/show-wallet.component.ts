import { Component, OnInit } from '@angular/core';
import { PaymentWalletService } from '../services/payment-wallet.service';
import { Wallet } from '../model/wallet.model';

@Component({
  selector: 'xp-show-wallet',
  templateUrl: './show-wallet.component.html',
  styleUrls: ['./show-wallet.component.css']
})
export class ShowWalletComponent {
  wallet: Wallet | null = null;

  constructor(private walletService: PaymentWalletService) {}

  ngOnInit(): void {
    this.walletService.getWallet().subscribe((data: Wallet) => {
      this.wallet = data;
    });
  }
}
