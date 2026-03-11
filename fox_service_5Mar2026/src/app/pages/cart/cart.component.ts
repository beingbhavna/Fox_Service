import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
declare var google: any;
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, AfterViewInit {
  gstPercent = 18; // example GST %
  cartItems: any[] = [];
  selectedCity: any;
  showAddressPopup = false;
  showAddressForm = false;
  address: string = '';
  type: string = 'home';
  addressForm!: FormGroup;
  showOtherInput = false;
  showSlotPopup = false;
  selectedDate: any;
  selectedSlot: any;
  currentDate = new Date();
  currentMonth!: number;
  currentYear!: number;
  calendarDays: number[] = [];
  filteredSlots: any[] = [];
  showCartModal = false;
  comment: any;
  daysName = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  // timeSlots:any;
  timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM'
  ];
  @ViewChild('locationInput', { static: false }) locationInput!: ElementRef;
  cartDetails: any;
  cityId: any;
  addressResponse: any;
  CartData: any;
  successMessage: any;
  showSuccess: boolean = false;
  errorMessage: any;
  showError: boolean = false;

  constructor(private cartService: CartService,
    private router: Router,
    private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit() {
    this.cityId = JSON.parse(localStorage.getItem('cityId') || '{}').id;
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
    this.selectedCity = this.cartItems.length > 0 ? this.cartItems[0].cities[0].name : '';
    this.addressForm = this.fb.group({
      name: [''],
      email: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      city: [''],
      landmark: [''],
      house_building_name: [''],
      type: ['Home'],
      city_id: [this.cityId],
      road_area_colony: ['']
    });
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.selectedDate = new Date().getDate();
  }

  removeItem(id: number) {
    this.cartService.removeItem(id);
  }

  get total() {
    return this.cartItems.reduce(
      (sum, item) => sum + item.cities[0].pivot.price, 0
    );
  }

  continue() {
    if (localStorage.getItem('loginFlag')) {
      this.showAddressPopup = true;
      this.getCartData()
    } else {
      // open login modal at second time
      this.cartService.openModal();
    }
  }

  backToHome() {
    this.router.navigate(['/']);
  }

  getThreeSpecs(specHtml: string): string {
    return specHtml.split('</p>').slice(0, 3).join('</p>');
  }

  openWhatsApp() {
    window.open('https://api.whatsapp.com/send?phone=918889998382&text=Hello,%20I%20have%20a%20question%20about', '_blank');
  }

  getTotalWithGST(): number {
    let subtotal = 0;
    this.cartItems.forEach(item => {
      subtotal += item.cities[0].pivot.price;
    });
    const gstAmount = (subtotal * this.gstPercent) / 100;
    return subtotal + gstAmount;
  }

  // openAddressPopup() {
  //   this.showAddressPopup = true;
  // }

  closeAddressPopup() {
    this.showAddressPopup = false;
  }

  openAddressForm() {
    this.showAddressPopup = false;
    this.showAddressForm = true;
  }

  backToPopup() {
    this.showAddressForm = false;
    this.showAddressPopup = true;
  }

  ngAfterViewInit() {
    console.log(google.maps.places)
    const autocomplete = new google.maps.places.Autocomplete(
      this.locationInput.nativeElement,
      {
        types: ['geocode']
      }
    );
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        this.addressForm.patchValue({
          road_area_colony: place.formatted_address
        });
      }
    });
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat: lat, lng: lng };
      geocoder.geocode({ location: latlng }, (results: any) => {
        if (results[0]) {
          this.addressForm.patchValue({
            road_area_colony: results[0].formatted_address
          });
        }
      });
    });
  }

  selectAddressType(type: string) {
    this.addressForm.patchValue({
      type: type
    });
    if (type === 'Other') {
      this.showOtherInput = true;
    } else {
      this.showOtherInput = false;
      this.addressForm.patchValue({ otherType: '' });
    }
  }

  submitAddress() {
    let payload = { ...this.addressForm.value };
    if (payload.type === 'Other') {
      payload.type = payload.otherType;
    }
    payload.phone = 91 + payload.phone; // prepend country code
    this.apiService.saveAddress(payload).subscribe({
      next: (response: any) => {
        console.log('Address saved successfully', response);
        this.addressResponse = response.address;
        this.successMessage = response.message;
        this.showAddressForm = false;
        this.showSlotPopup = true;
        this.generateCalendar();
      },
      error: (err) => {
        console.log('Error saving address', err);
        this.errorMessage = err?.error?.message || "Something went wrong";
        this.showError = true;
        this.showSuccess = false;
      }
    });
  }

  confirmSlot() {
    const payload = {
      date: this.selectedDate,
      slot: this.selectedSlot
    };
    console.log("Slot Payload:", payload);
  }

  generateCalendar() {
    this.getTimeslotData();
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.calendarDays = [];
    for (let i = 1; i <= days; i++) {
      this.calendarDays.push(i);
    }
    const today = new Date();
    if (this.selectedDate === today.getDate() && this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear()) {
      this.filterSlots();
      this.getCartData();
    } else {
      this.filteredSlots = this.timeSlots;
    }
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  selectDate(day: number) {
    this.selectedDate = day;
    const today = new Date();
    if (day === today.getDate()) {
      this.filterSlots();
    } else {
      this.filteredSlots = this.timeSlots;
    }
  }

  selectSlot(slot: any) {
    this.selectedSlot = slot;

    console.log("Selected Slot ID:", slot.id);
    console.log("Selected Slot:", slot);
  }

  isPastDate(day: number) {
    const date = new Date(this.currentYear, this.currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  filterSlots() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    this.filteredSlots = this.timeSlots.filter((slot: any) => {
      const [hour, minute] = slot.start_time.split(':').map(Number);
      const slotMinutes = hour * 60 + minute;
      return slotMinutes > currentMinutes;
    });
  }

  submit() {
    const payload = {
      date: this.selectedDate,
      month: this.currentMonth + 1,
      year: this.currentYear,
      timeSlot: this.selectedSlot
    };
    console.log("Payload:", payload);
    this.showSlotPopup = false;
    this.showCartModal = true;
  }

  close() {
    console.log("close modal");
  }

  closeCart() {
    this.showCartModal = false;
  }

  getCartData() {
    this.apiService.getCartData().subscribe((response: any) => {
      this.CartData = response.services;
    });
  }

  getTimeslotData() {
    this.apiService.getTimeslotData().subscribe({
      next: (data) => {
        console.log('Timeslots data:', data);
        this.timeSlots = data.slots || [];
        this.filterSlots();
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }

  payLater() {
    const payload = {
      address_id: this.addressResponse.id,
      cart_id: 11116, // number not string
      comment: this.comment || '',
      date: `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(this.selectedDate).padStart(2, '0')}`,
      time_slot_id: this.selectedSlot?.id,
      total_price: this.getTotalWithGST().toFixed(2), // string with 2 decimals
      type: "COD"
    };
    console.log("Pay Later Payload:", payload);
    this.apiService.payment(payload as any).subscribe({
      next: (response: any) => {
        console.log('Payment successful', response);
        this.successMessage = response.message || 'Your order has been placed successfully';
        // Your order has been placed successfully
        this.showSuccess = true;
        this.showError = false;
        this.showCartModal = false;
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err?.error?.message || "Something went wrong";
        this.showError = true;
        this.showSuccess = false;
      }
    });
  }
  closeError() {
    this.showSuccess = false;
    this.showError = false;
  }
}


// address_id: 7152
// cart_id: 11116
// comment: ""
// date: "2026-03-12"
// time_slot_id: 21
// total_price: "70.00"
// type: "COD"