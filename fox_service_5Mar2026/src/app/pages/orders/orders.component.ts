import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  pageHtml = '';
  constructor(private http: HttpClient, private apiService: ApiService) { }
  ordersData: any;

  ngOnInit(): void {
    this.http.get('assets/templates/orders.html', { responseType: 'text' })
      .subscribe(html => this.pageHtml = html);
  }

  openWhatsApp() {
    window.open('https://api.whatsapp.com/send?phone=918889998382&text=Hello,%20I%20have%20a%20question%20about', '_blank');
  }

  getOrderData() {
    this.apiService.getOrderData().subscribe({
      next: (data) => {
        console.log('orders:', data);
        this.ordersData = data.orders || [];
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }
}

