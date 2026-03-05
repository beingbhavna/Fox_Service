import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  private cartService = inject(CartService);
  cart$ = this.cartService.cart$;

  updateQuantity(id: string | number, qty: string) {
    const q = Number(qty);
    if (q > 0) this.cartService.updateQuantity(id, q);
  }

  remove(id: string | number) {
    this.cartService.removeItem(id);
  }

  clear() {
    this.cartService.clear();
  }
}