import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isSticky = false;
  loginForm: FormGroup;
  loginShowModal = false;
  showError = false;
  errorMessage = '';
  phone: string = '';
  showModal = true;
  showOtpScreen = false;
  showErrorPopup = false;
  message = '';
  timer: number = 30;
  intervalId: any;
  activeBrand: string = 'All';
  menuOpen = false;

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
  constructor(private cartService: CartService, private fb: FormBuilder,private router: Router) {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.length;
    });
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  openLoginModal() {
    this.loginShowModal = true;
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  continue() {
    // DO NOT submit form
    if (!this.phone || this.phone.length !== 10) {
      this.showError = true;
      return;
    }
    this.showOtpScreen = true;
    this.startTimer();
    // success logic here (OTP API etc)
    console.log('Valid phone');
  }

  startTimer() {
    this.timer = 30;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  closeError() {
    this.showError = false;
  }

  resendOtp() {
    this.startTimer();
    console.log('OTP resent');
  }

  close() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    // close modal routing
    this.loginShowModal = false;
  }

  // allow only numbers
  public checkInput(event: any) {
    var ctrlCode = (event.ctrlKey) ? event.ctrlKey : event.metaKey;  // get key cross-browser
    var charCode = (event.which) ? event.which : event.keyCode;      // get key cross-browser
    if ( // Allow: home, end, left, right, down, up
      (charCode >= 35 && charCode <= 40)
      // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
      || (charCode == 65 || charCode == 86 || charCode == 67) && (ctrlCode === true)) {
      return true;
    }
    if (charCode > 31
      && (charCode < 48 || charCode > 57)) {
      return false;
    }
    else {
      return true
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
