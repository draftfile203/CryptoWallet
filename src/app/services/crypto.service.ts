// crypto.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  
  // Inject the HttpClient to make HTTP requests to external APIs
  constructor(private http: HttpClient) {}

  // Fetch a list of trending cryptocurrencies from CoinGecko API
  getTrendingCoins() {
    return this.http.get('https://api.coingecko.com/api/v3/search/trending');
  }

  // Fetch the current price of a specific coin in USD by its ID
  getPrice(id: string) {
    return this.http.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
    );
  }
}