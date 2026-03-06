import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';

interface BikeModel {
  id: number;
  slug: string;
  name: string;
  image: string;
  banner: string;
}

@Component({
  selector: 'app-bike-list',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderComponent],
  templateUrl: './bike-list.component.html',
  styleUrl: './bike-list.component.scss'
})
export class BikeListComponent {
  isSticky = false;
  model: any;
  bikes: BikeModel[] = [];
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


  brands = ['All', 'Honda', 'TVS', 'Bajaj', 'Hero', 'Yamaha', 'Suzuki', 'KTM', 'Other'];
  slides = [
    {
      image: 'assets/images/serviceSlide.jpg',
      title: 'Upto 150cc Service in Noida',
      subtitle: 'Get instant access to reliable and affordable services'
    }
  ];
  bikeData: any;
  constructor(
    private router: Router,
    private service: ApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.route.paramMap.subscribe(params => {
      this.model = params.get('model');
    });
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  ngOnInit() {
    this.getBikeData();
  }

  openWhatsApp() {
    window.open('https://api.whatsapp.com/send?phone=918889998382&text=Hello,%20I%20have%20a%20question%20about', '_blank');
  }

  get filteredBikes(): BikeModel[] {
    if (this.activeBrand === 'All') return this.bikes;

    return this.bikes.filter(bike =>
      bike.name.toLowerCase().includes(this.activeBrand.toLowerCase())
    );
  }

  openLoginModal() {
    this.loginShowModal = true;
  }

  filterBrand(brand: string) {
    this.activeBrand = brand;
  }

  goToDetails(bike: BikeModel) {
    this.router.navigate(['/bikeDetail', bike.slug]);
  }

  getBikeData() {
    let cityName = JSON.parse(localStorage.getItem('cityId') || '{}').slug;

    this.service.getBikeData(this.model, cityName).subscribe((response: any) => {
      this.bikeData = response.category;
      this.getBikeCategoriesList();
    });
  }

  getBikeCategoriesList() {
    let cityName = JSON.parse(localStorage.getItem('cityId') || '{}').slug;

    this.service.getSubcategoriesBikeData(this.model, cityName).subscribe((response: any) => {
      this.bikes = response.subcategories.data;
    });
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