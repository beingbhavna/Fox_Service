import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ServicesGridComponent } from '../services-grid/services-grid.component';
import { BrandsComponent } from '../brands/brands.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ServicesGridComponent, TestimonialsComponent, BrandsComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cityList: any;
  selectedCity: any;
  subcategoriesList: any;
  timeSlotsList: any;
  bookingForm: any;
  model: any;
  bikes: any;
  bikeData: any;
  cityName: any;
  settingsData: any;
  showSuccess: boolean = false;
  succssMessage: any;
  categoryId: any;
  selectedModelId: any;

  constructor(private router: Router, private fb: FormBuilder, private service: ApiService, private cd: ChangeDetectorRef) {
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

  ngOnInit() {
    setInterval(() => {
      this.nextSlide();
    }, 4000);
    this.getCityList();
    // this.getSubcategoriesData();
    this.getTimeslotData();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.settingsData.length;
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
    this.showSuccess = false;
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
    this.service.show();
    this.service.getCityData().subscribe({
      next: (data) => {
        console.log('City data:', data);
        this.cityList = data.cities || [];
        if (this.cityName) {
          this.selectedCity = this.cityName;
          const selectedCityObj = this.cityList.find((city: any) => city.name.toLowerCase() === this.cityName.toLowerCase());
          localStorage.setItem('cityId', JSON.stringify(selectedCityObj));
        } else {
          this.selectedCity = this.cityList.length > 0 ? this.cityList[0].name : null;
          localStorage.setItem('cityId', JSON.stringify(this.cityList[0])); // default to first city if available
        }
        this.getSubcategoriesData();
        this.getSettingsData();
      },
      error: (error) => {
        console.error('Error fetching city data:', error);
      }
    });
  }

  getSettingsData() {
    let cityId = localStorage.getItem('cityId') || '1'; // default to 1 if not set
    this.service.getSettingsData((JSON.parse(cityId)).id).subscribe({
      next: (data) => {
        this.settingsData = data.banners || {};
        this.getTimeslotData();
      },
      error: (error) => {
        console.error('Error fetching settings data:', error);
      }
    });
  }

  getSubcategoriesData() {
    let cityId = localStorage.getItem('cityId') || '1'; // default to 1 if not set
    this.service.getSubcategoriesData((JSON.parse(cityId)).id).subscribe({
      next: (data) => {
        console.log('Subcategories data:', data);
        this.subcategoriesList = data.city.categories[0].subcategories || [];
        this.categoryId = data.city.categories[0].pivot.category_id;
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
    const selectedCategory = this.subcategoriesList.find(
      (res: any) => res.slug === this.model
    );
    if (selectedCategory) {
      var subCategoryId = selectedCategory.id;
    }
    const payload = {
      phone: this.bookingForm.value.phone,
      city_id: this.bookingForm.value.city,
      email: this.bookingForm.value.email,
      name: this.bookingForm.value.name,
      address_id: this.bookingForm.value.address,
      category_id: this.categoryId,
      date: this.bookingForm.value.date,
      modal_id: this.selectedModelId,
      service_id: this.bookingForm.value.service,
      subcategory_id: subCategoryId,
      time_slot_id: this.bookingForm.value.timeSlot,
    };
    this.service.onQuickBookingSubmit(payload).subscribe({
      next: (res: any) => {
        console.log(res);
        this.succssMessage = res.message || "Booking submitted successfully";
        this.quickBookingShowModal = false;
        this.showSuccess = true;
        this.cd.detectChanges();
        this.showError = false;
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err?.error?.message || "Something went wrong";
        this.showError = true;
        this.cd.detectChanges();
        this.showSuccess = false;
      }
    });
  }

  onCityChange(event: any) {
    this.cityName = event.target.value;
    this.router.navigate(['/city', this.cityName.toLowerCase()]);
    this.ngOnInit();
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
    const selectedModel = this.bikes.find(
      (res: any) => res.slug === this.model
    );
    if (selectedModel) {
      this.selectedModelId = selectedModel.id;
    }
    this.getBikeData();
  }

  getBikeData() {
    let cityName = JSON.parse(localStorage.getItem('cityId') || '{}').slug;
    this.service.getBikeData(this.model, cityName).subscribe((response: any) => {
      this.bikeData = response.services;
    });
  }

  // loginWithOtp() {
  //   const model = this.bookingForm.value;
  //   this.service.onQuickBookingSubmit(model).subscribe({
  //     next: (res) => {
  //       console.log('Success:', res);
  //     },
  //     error: (err) => {
  //       console.error('Error:', err);
  //       alert('Something went wrong');
  //     }
  //   });
  // }

  oepnCalling(){
    
  }
}