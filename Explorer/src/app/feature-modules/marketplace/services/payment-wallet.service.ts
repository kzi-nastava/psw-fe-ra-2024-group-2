import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Wallet } from '../model/wallet.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentWalletService {
  constructor(private http: HttpClient) {}

  getWallet(): Observable<Wallet> {
    return this.http.get<Wallet>(`${environment.apiHost}tourist/wallet`);
  }
}
