import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string | number;
  title?: string;
  price?: number;
  quantity?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'app_cart_v1';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.load());
  // cart$ = this.cartSubject.asObservable();

  constructor() { }

  private save(items: CartItem[]) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  getCart(): CartItem[] {
    return this.cartSubject.value.slice();
  }

  addItem(item: CartItem) {
    const items = this.getCart();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx > -1) {
      items[idx].quantity = (items[idx].quantity || 1) + (item.quantity || 1);
    } else {
      items.push({ ...item, quantity: item.quantity || 1 });
    }
    this.cartSubject.next(items);
    this.save(items);
  }

  updateQuantity(id: string | number, quantity: number) {
    const items = this.getCart().map(i => i.id === id ? { ...i, quantity } : i);
    this.cartSubject.next(items);
    this.save(items);
  }

  removeItem(id: string | number) {
    const items = this.getCart().filter(i => i.id !== id);
    this.cartSubject.next(items);
    this.save(items);
  }

  clear() {
    this.cartSubject.next([]);
    this.save([]);
  }

  //  cartItems: any[] = [];

  // add(item: any) {
  //   this.cartItems.push(item);
  // }

    private cartItems = new BehaviorSubject<any[]>([]);
  cart$ = this.cartItems.asObservable();

  addToCart(item: any) {
    const items = this.cartItems.value;
    if (!items.find(x => x.name === item.name)) {
      this.cartItems.next([...items, item]);
    }
  }

  isInCart(item: any): boolean {
    return this.cartItems.value.some(x => x.name === item.name);
  }
}
