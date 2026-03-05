import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string | number;
  title?: string;
  price?: number;
  quantity?: number;
  model?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly STORAGE_KEY = 'app_cart_v1';

  private cartSubject = new BehaviorSubject<CartItem[]>(this.load());

  constructor() {}

  // SAVE TO LOCAL STORAGE
  private save(items: CartItem[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }

  // LOAD FROM LOCAL STORAGE
  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // GET CART
  getCart(): CartItem[] {
    return this.cartSubject.value.slice();
  }

  // ADD TO CART
  addToCart(item: any,model:any) {

    const items = this.cartSubject.value;

    // CHECK SAME SERVICE + SAME MODEL
    const exists = items.find(x =>
      x.id === item.id &&
      x.model === model
    );

    if (!exists) {
      const updatedItems = [...items, item];
      this.cartSubject.next(updatedItems);
      this.save(updatedItems);
    }
  }

  // CHECK IF ITEM IS IN CART
  isInCart(item: any): boolean {
    return this.cartSubject.value.some(x =>
      x.id === item.id &&
      x.model === item.model
    );
  }

  // REMOVE ITEM
  removeItem(id: string | number) {

    const items = this.cartSubject.value.filter(x => x.id !== id);

    this.cartSubject.next(items);

    this.save(items);
  }

  // CLEAR CART
  clear() {
    this.cartSubject.next([]);
    this.save([]);
  }

  // OBSERVABLE CART
  cart$ = this.cartSubject.asObservable();
}