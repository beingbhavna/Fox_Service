import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ServicesGridComponent } from '../services-grid/services-grid.component';
import { BrandsComponent } from '../brands/brands.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule ,ServicesGridComponent, TestimonialsComponent, BrandsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router,private fb: FormBuilder) {
     this.loginForm = this.fb.group({
          phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        });
   }
  images = [
    'assets/images/slider/1.jpg',
    'assets/images/slider/2.jpg',
    'assets/images/slider/3.jpg',
    'assets/images/slider/4.jpg',
    'assets/images/slider/5.jpg',
    'assets/images/slider/6.jpg',
    'assets/images/slider/01.png',
    'assets/images/slider/03.png',
    'assets/images/slider/04.png',
    'assets/images/slider/slider-banner4.jpg'
  ];
  isSticky = false;
  showPopup = false;
  activeIndex = 0;
  quickBookingShowModal = false;

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

  bikes = [
    { name: 'Upto 150cc', icon: 'assets/images/150cc.jpg' },
    { name: 'Upto 151 to 250cc', icon: 'assets/images/250cc.jpg' },
    { name: '251 to 350cc', icon: 'assets/images/350cc.jpg' },
    { name: 'Above 351cc', icon: 'assets/images/above350cc.jpg' }
  ];
  
  @HostListener('window:scroll')
  onScroll() {
    this.isSticky = window.scrollY > 50;
  }
  
  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  selectItem(i: number) {
    this.activeIndex = i;
  }
  currentIndex = 0;
  slides = [
    {
      image: 'assets/images/slider/01.png',
      title: 'Your Doorstep Bike Service Expert in Noida',
      subtitle: 'Get instant access to reliable and affordable services at your door step.'
    },
    {
      image: 'assets/images/royalEnfield.jpg',
      title: 'Convenient and hassle-free appointments',
      subtitle: '24 X 7 Convenient Online Booking'
    },
    {
      image: 'assets/images/slides.jpg',
      title: 'Pick-up & Drop Facility',
      subtitle: 'Your convenience is our motto, we will pick your bike and deliver at your doorstep, spend that extra time with your loved ones.'
    }
  ];

  ngOnInit() {
    setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  openQuickBooking() {
    this.router.navigate(['/quick-booking']);
  }

  quickBookingOpenModal() {
    this.quickBookingShowModal = true;
  }

  quickBookingCloseModal() {
    this.quickBookingShowModal = false;
  }
  openBikeList(category: string) {
    this.router.navigate(['/bike-scooty/' + category]);
  }

  //login code

  openLoginModal(){
    this.loginShowModal = true;
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

  getCities(){
    this.http.get<any>('https://www.foxservice.in/admin/api/timeslot/get').subscribe(data => {
      console.log(data);
    }
  }

}