import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  addressType: string = 'home';
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
  daysName = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
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

  constructor(private cartService: CartService,
    private router: Router,
    private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
    this.selectedCity = this.cartItems.length > 0 ? this.cartItems[0].cities[0].name : '';
    this.addressForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      city: [''],
      landmark: [''],
      house_building_name: [''],
      addressType: ['Home'],
      type: [''],
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
    this.showAddressPopup = true;
    // open login modal at second time
    // this.cartService.openModal();
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
      addressType: type
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
    if (payload.addressType === 'Other') {
      payload.addressType = payload.otherType;
    }
    this.apiService.saveAddress(payload).subscribe(response => {
      console.log('Address saved successfully', response);
      this.showAddressForm = false;
      this.showSlotPopup = true;
      this.generateCalendar();
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
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.calendarDays = [];
    for (let i = 1; i <= days; i++) {
      this.calendarDays.push(i);
    }
    if (this.selectedDate === new Date().getDate() && this.currentMonth === new Date().getMonth() && this.currentYear === new Date().getFullYear()) {
      this.filterSlots();
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
  }

  isPastDate(day: number) {
    const date = new Date(this.currentYear, this.currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  filterSlots() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    this.filteredSlots = this.timeSlots.filter((slot: string) => {
      // get start time only
      const startTime = slot.split(' - ')[0]; // "09:00 AM"
      const [time, modifier] = startTime.split(' ');
      let [hour, minute]: any = time.split(':');
      hour = parseInt(hour, 10);
      minute = parseInt(minute, 10);
      if (modifier === 'PM' && hour !== 12) {
        hour += 12;
      }
      if (modifier === 'AM' && hour === 12) {
        hour = 0;
      }
      const slotTime = hour * 60 + minute;
      return slotTime > currentTime;
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
  }

  close() {
    console.log("close modal");
  }
}