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
  user: any;
  isLoading = true;
  trendingCoins: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser =
        localStorage.getItem('loggedInUser') ||
        localStorage.getItem('RegisteredUser');

      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }

      this.loadTrendingCoins();

      setTimeout(() => {
        this.isLoading = false;
      });
    }
  }

  loadTrendingCoins(): void {
    this.cryptoService.getTrendingCoins().subscribe((res: any) => {
      const topCoins = res.coins.slice(0, 5);
      this.trendingCoins = topCoins.map((item: any, index: number) => ({
        rank: index + 1,
        name: item.item.name,
        symbol: item.item.symbol,
        image: item.item.small,
        id: item.item.id,
        price: null
      }));

      this.trendingCoins.forEach(coin => {
        this.cryptoService.getPrice(coin.id).subscribe((priceData: any) => {
          coin.price = priceData[coin.id]?.usd;
        });
      });
    });
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('RegisteredUser');
    this.router.navigate(['/main']);
  }
}
