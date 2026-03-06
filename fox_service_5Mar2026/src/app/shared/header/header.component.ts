import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  @Input() cartCount = 0;
  constructor(private cartService: CartService, private fb: FormBuilder,private router: Router,private service:ApiService) {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.length;
    });
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }
   toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

   goToHome() {
    this.router.navigate(['/']);
  }

    //login code

  openLoginModal() {
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
  }

    sendOtp() {
    const model = this.phone
    this.service.sendOtp(model).subscribe({
      next: (data) => {
        console.log('Timeslots data:', data);
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

   loginWithOtp(){
    const model = this.loginForm.value;
    const cityName = this.loginForm.value.city; // or selected city id
    this.service.onQuickBookingSubmit(model, cityName).subscribe({
      next: (res) => {
        console.log('Success:', res);
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Something went wrong');
      }
    });
  }
}
