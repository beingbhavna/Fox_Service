import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';

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
  showSuccess = false;
  errorMessage = '';
  phone: string = '';
  showModal = true;
  showOtpScreen = false;
  showErrorPopup = false;
  showLogoutMessage = false;
  message = '';
  timer: number = 30;
  intervalId: any;
  activeBrand: string = 'All';
  menuOpen = false;
  @Input() cartCount = 0;
  loginFlag: any;
  succssMessage: any;
  currentUrl: any;
  cartItems: any[] = [];

  constructor(private cartService: CartService, private fb: FormBuilder, private router: Router, private service: ApiService) {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.length;
      this.cartItems = items;
    });
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      otp: ['1234', Validators.required],
    });
  }

  ngOnInit() {
    this.cartService.openModal$.subscribe(() => {
      this.currentUrl = this.router.url; // save current page
      this.loginShowModal = true;
    });
    this.loginFlag = localStorage.getItem('loginFlag');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  //login code

  openLoginModal() {
    this.currentUrl = this.router.url; // save current page
    this.menuOpen = false;
    this.loginShowModal = true;
    this.intervalId = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  submit() {
    if (this.f['phone'].invalid) {
      this.message = '10 digit Phone number is required';
      this.showErrorPopup = true;
      return;
    }
    // simulate OTP screen
    this.showOtpScreen = true;
  }

  get f() {
    return this.loginForm.controls;
  }

  continue() {
    localStorage.setItem('phone',this.phone);
    // DO NOT submit form
    if (!this.phone || this.phone.length !== 10) {
      this.showError = true;
      return;
    }
    this.sendOtp();
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
    this.showSuccess = false;
    this.showLogoutMessage = false;
  }

  sendOtp() {
    const model = this.phone
    this.service.sendOtp(model).subscribe({
      next: (data) => {
        this.service.hide();
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }

  resendOtp() {
    this.startTimer();
    this.sendOtp();
    console.log('OTP resent');
  }

  closeLoginModal() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    // close modal routing
    this.loginShowModal = false;
    this.menuOpen = false;
    clearInterval(this.intervalId);
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

  loginWithOtp() {
    const payload = {
      phone: '91' + this.phone,
      otp: this.loginForm.value.otp
    };
    this.service.login(payload).subscribe({
      next: (data) => {
        localStorage.setItem('loginFlag', 'true');
        localStorage.setItem('token', data.token);
        if (this.cartItems.length) {
          this.addItemsToCart();
        }
        this.closeLoginModal();
        this.service.hide();
        // this.showSuccess = true;
        // this.succssMessage = data.message;
        // redirect to same page
        this.router.navigateByUrl(this.currentUrl || '/');
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Login error:', error);
        // this.errorMessage = error.error.message || 'Login failed. Please try again.';
        // this.showError = true;
      }
    });
  }

  logout() {
    localStorage.clear();
    // localStorage.removeItem('token');
    // localStorage.removeItem('loginFlag');
    // localStorage.removeItem('phone');
    this.loginFlag = false;
    this.showLogoutMessage = true;
    this.router.navigate(['/']);
  }

  // @HostListener('document:click', ['$event'])
  // clickOutside(event: any) {
  //   if (!event.target.closest('.profile-menu')) {
  //     this.profileOpen = false;
  //   }
  // }

  addItemsToCart() {
    const categoryId = localStorage.getItem('categoryId');
    const payload = {
      category_id: categoryId,
      city_id: this.cartItems[0].cities[0].pivot.city_id,
      price: this.cartItems[0].cities[0].pivot.price,
      service_id: this.cartItems[0].cities[0].pivot.service_id
    }
    this.service.addItemsToCart(payload).subscribe({
      next: (data) => {
        this.service.hide();
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }

}
