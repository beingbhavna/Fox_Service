import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { BrandsComponent } from '../brands/brands.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ServicesGridComponent } from '../services-grid/services-grid.component';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule,ServicesGridComponent, TestimonialsComponent, BrandsComponent],
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent {
 cityList: any;
  selectedCity: any;
  subcategoriesList: any;
  timeSlotsList: any;
  bookingForm: any;
  model: any;
  bikes: any;
  bikeData: any;
  constructor(private router: Router, private fb: FormBuilder, private service: ApiService) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

    this.bookingForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      city: [''],
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      service: [''],
      vehicleType: [''],
      ccDetails: [''],
      model: [''],
      timeSlot: [''],
      address: [''],
      date: ['']
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
    this.getCityList();
    // this.getSubcategoriesData();
    this.getTimeslotData();
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

  openWhatsApp() {
    window.open('https://api.whatsapp.com/send?phone=918889998382&text=Hello,%20I%20have%20a%20question%20about', '_blank');
  }

  openBikeList(category: any) {
     let cityName = JSON.parse(localStorage.getItem('cityId') || '{}').slug;
    console.log('Selected category:', category);
    this.router.navigate(['/' + cityName + '/bike-scooty/' + category]);
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
  //login code end

  getCityList() {
    this.service.getCityData().subscribe({
      next: (data) => {
        console.log('City data:', data);
        this.cityList = data.cities || [];
        this.selectedCity = this.cityList.length > 0 ? this.cityList[0].id : null;
        localStorage.setItem('cityId', JSON.stringify(this.cityList[0])); // default to first city if available
        this.getSubcategoriesData();
        this.getTimeslotData();
      },
      error: (error) => {
        console.error('Error fetching city data:', error);
      }
    });
  }

  getSubcategoriesData() {
    let cityId = localStorage.getItem('cityId') || '1'; // default to 1 if not set
    this.service.getSubcategoriesData((JSON.parse(cityId)).id).subscribe({
      next: (data) => {
        console.log('Subcategories data:', data);
        this.subcategoriesList = data.city.categories[0].subcategories || [];
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }

  getTimeslotData() {
    this.service.getTimeslotData().subscribe({
      next: (data) => {
        console.log('Timeslots data:', data);
        this.timeSlotsList = data.slots || [];
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }

  sendOtp() {
    const model = this.phone
    this.service.sendOtp(model).subscribe({
      next: (data) => {
        console.log('Timeslots data:', data);
        // this.timeSlotsList = data.slots || [];
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }

  onQuickBookingSubmit() {
    const model = this.bookingForm.value;
    const cityName = this.bookingForm.value.city; // or selected city id

    this.service.onQuickBookingSubmit(model, cityName).subscribe({
      next: (res) => {
        console.log('Success:', res);
        // alert('Booking submitted successfully');
        // this.bookingForm.reset();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Something went wrong');
      }
    });
  }

  onCityChange(event: any) {
    this.getCityList();
  }

  changeBikeCCDetails(event: any) {
    this.model = event.target.value;
    this.getBikeCategoriesList();
  }

  getBikeCategoriesList() {
    let cityName = JSON.parse(localStorage.getItem('cityId') || '{}').slug;
    this.service.getSubcategoriesBikeData(this.model, cityName).subscribe((response: any) => {
      this.bikes = response.subcategories.data;
    });
  }

  changeBikeModel(event: any) {
    this.model = event.target.value;
    this.getBikeData();
  }

  getBikeData() {
    let cityName = JSON.parse(localStorage.getItem('cityId') || '{}').slug;
    this.service.getBikeData(this.model, cityName).subscribe((response: any) => {
      this.bikeData = response.services;
    });
  }

  loginWithOtp(){
    const model = this.bookingForm.value;
    const cityName = this.bookingForm.value.city; // or selected city id
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