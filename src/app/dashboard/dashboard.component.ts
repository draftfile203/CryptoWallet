import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, RouterModule,NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: any; // Stores user data from localStorage
  isLoading = true; // Flag to manage loading spinner or UI state
  trendingCoins: any[] = []; // Array to store top trending coins

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    // Check if running in browser (not server-side)
    if (isPlatformBrowser(this.platformId)) {
      // Try to get logged-in or registered user from localStorage
      const storedUser =
        localStorage.getItem('loggedInUser') ||
        localStorage.getItem('RegisteredUser');

      // Parse and assign the user if present
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }

      // Load trending cryptocurrency coins
      this.loadTrendingCoins();

      // Stop loading indicator after a short delay
      setTimeout(() => {
        this.isLoading = false;
      });
    }
  }

  // Fetch trending coin data and then individual prices
  loadTrendingCoins(): void {
    this.cryptoService.getTrendingCoins().subscribe((res: any) => {
      const topCoins = res.coins.slice(0, 5); // Limit to top 5 coins

      // Map raw data into a cleaner format
      this.trendingCoins = topCoins.map((item: any, index: number) => ({
        rank: index + 1,
        name: item.item.name,
        symbol: item.item.symbol,
        image: item.item.small,
        id: item.item.id,
        price: null // Placeholder for price
      }));

      // Fetch current price for each coin
      this.trendingCoins.forEach(coin => {
        this.cryptoService.getPrice(coin.id).subscribe((priceData: any) => {
          coin.price = priceData[coin.id]?.usd;
        });
      });
    });
  }

  // Logout user and redirect to main page
  logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('RegisteredUser');
    this.router.navigate(['/main']);
  }
}