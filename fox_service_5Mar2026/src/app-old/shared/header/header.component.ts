import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // cartCount$: Observable<number>;
  // user$: Observable<any> = null as any;
  // showLogin = false;
  // mobile = '';

  // constructor(private cart: CartService, private auth: AuthService) {
  //   this.cartCount$ = this.cart.cart$.pipe(map(items => items.reduce((s, i) => s + (i.quantity || 0), 0)));
  //   this.user$ = this.auth.user$;
  // }

  // openLogin() { this.showLogin = true; }
  // closeLogin() { this.showLogin = false; }

  // login() {
  //   if (!this.mobile) return;
  //   this.auth.login(this.mobile);
  //   this.mobile = '';
  //   this.showLogin = false;
  // }

  // logout() {
  //   this.auth.logout();
  // }



//    menuOpen = false;
// isSticky = false;

// @HostListener('window:scroll')
// onScroll() {
//   this.isSticky = window.scrollY > 50;
// }

//   toggleMenu() {
//     this.menuOpen = !this.menuOpen;
//   }

  // cartCount = 0;
@Input() cartCount = 0;
  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.length;
    });
  }
}
