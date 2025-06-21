// crypto.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  constructor(private http: HttpClient) {}

  getTrendingCoins() {
    return this.http.get('https://api.coingecko.com/api/v3/search/trending');
  }

  getPrice(id: string) {
    return this.http.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
  }
}
