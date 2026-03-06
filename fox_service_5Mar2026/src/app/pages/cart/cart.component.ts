import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  gstPercent = 18; // example GST %
  cartItems: any[] = [];
  selectedCity: any;

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
    this.selectedCity = this.cartItems.length > 0 ? this.cartItems[0].cities[0].name : '';
  }

  removeItem(id: number) {
    this.cartService.removeItem(id);
  }

  get total() {
    return this.cartItems.reduce(
      (sum, item) => sum + item.cities[0].pivot.price, 0
    );
  }

  continue() {
    alert('Proceed to checkout');
  }

  backToHome() {
    this.router.navigate(['/']);
  }

  getThreeSpecs(specHtml: string): string {
    return specHtml.split('</p>').slice(0, 3).join('</p>');
  }

  openWhatsApp() {
    window.open('https://api.whatsapp.com/send?phone=918889998382&text=Hello,%20I%20have%20a%20question%20about', '_blank');
  }

  getTotalWithGST(): number {
    let subtotal = 0;

    this.cartItems.forEach(item => {
      subtotal += item.cities[0].pivot.price;
    });

    const gstAmount = (subtotal * this.gstPercent) / 100;

    return subtotal + gstAmount;
  }
}