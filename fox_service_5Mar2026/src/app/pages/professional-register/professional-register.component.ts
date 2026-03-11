import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-professional-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,HeaderComponent],
  templateUrl: './professional-register.component.html',
  styleUrl: './professional-register.component.scss'
})
export class ProfessionalRegisterComponent {
  registerForm!: FormGroup;
  menuOpen = false;
  cityList: any;
  selectedCity: any;
  selectedPhoto!: File;
  selectedAadhaar!: File;
  showErrorPopup = false;
  errorMessage = '';
  isSticky = false;
  loginShowModal=false;
  showError: boolean=false;
  phone: string = '';
  showModal = true;
  showOtpScreen = false;
  message = '';
  timer: number = 30;
  intervalId: any;
  loginForm: any;



  constructor(private service: ApiService, private fb: FormBuilder,private router:Router) { 
     this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }
  
  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      phone: ['', Validators.required],
      city: ['', Validators.required]
    });
    this.getCityList();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  getCityList() {
    this.service.getCityData().subscribe({
      next: (data) => {
        console.log('City data:', data);
        this.cityList = data.cities || [];
        this.selectedCity = this.cityList.length > 0 ? this.cityList[0].id : null;
        localStorage.setItem('cityId', JSON.stringify(this.cityList[0])); // default to first city if available
      },
      error: (error) => {
        console.error('Error fetching city data:', error);
      }
    });
  }

  onFileSelect(event: any, type: string) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Aadhaar must be an image (png, jpg, jpeg)';
      this.showErrorPopup = true;
      return;
    }

    if (type === 'photo') {
      this.selectedPhoto = file;
    }
    if (type === 'aadhaar') {
      this.selectedAadhaar = file;
    }
  }

  submitForm() {
    if (this.registerForm.invalid) return;

    const formData = new FormData();

    formData.append('first_name', this.registerForm.value.firstName);
    formData.append('last_name', this.registerForm.value.lastName);
    formData.append('email', this.registerForm.value.email);

    const phone = '91' + this.registerForm.value.phone;
    formData.append('phone', phone);

    formData.append('city_id', this.registerForm.value.city);

    if (this.selectedPhoto) {
      formData.append('photo', this.selectedPhoto);
      formData.append('upload_file', 'true');
    }

    if (this.selectedAadhaar) {
      formData.append('aadhar', this.selectedAadhaar);
      formData.append('upload_file', 'true');
    }

    // console.log(Array.from(formData.entries()));

    this.service.onRegister(formData).subscribe({
      next: res => console.log('Success', res),
      error: err => {
        console.error('Error', err)
        // backend message
        this.errorMessage = err.error?.error[0] || 'Something went wrong';

        // show popup
        this.showErrorPopup = true;
      }
    });
  }

  closePopup() {
    this.showErrorPopup = false;
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
    this.service.onQuickBookingSubmit(model).subscribe({
      next: (res) => {
        console.log('Success:', res);
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Something went wrong');
      }
    });
  }
      openWhatsApp() {
    window.open('https://api.whatsapp.com/send?phone=918889998382&text=Hello,%20I%20have%20a%20question%20about', '_blank');
  }
}
