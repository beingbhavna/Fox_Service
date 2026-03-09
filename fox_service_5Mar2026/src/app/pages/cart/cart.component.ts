import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
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
  timeSlots: string[] = [];
  currentDate = new Date();
  currentMonth!: number;
  currentYear!: number;
  calendarDays: number[] = [];
  today = new Date();
  slotError = false;
  daysName = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.selectedDate = this.today.getDate();
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

  getAddressFromCoords(lat: number, lng: number) {
    const apiKey = "YOUR_GOOGLE_MAP_API_KEY";
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.results.length > 0) {
          this.address = data.results[0].formatted_address;
        }
      });
  }

  getCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, longitude);
        this.getAddressFromCoords(latitude, longitude);
      },
      (error) => {
        console.error(error);
        alert("Location permission denied");
      }
    );
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
    // let formData = this.addressForm.value;
    // if (formData.addressType === 'Other') {
    //   formData.addressType = formData.otherType;
    // }
    // console.log(formData);


    let payload = { ...this.addressForm.value };

    if (payload.addressType === 'Other') {
      payload.addressType = payload.otherType;
    }

    /*
    Example payload sent to backend:
    {
    name:"Rahul",
    mobile:"918978978789",
    city:"Noida",
    landmark:"Sector 62",
    residenceNo:"Flat 203",
    addressType:"Friend House"
    }
    */
    this.apiService.saveAddress(payload).subscribe(response => {
      console.log('Address saved successfully', response);
      // close address popup
      this.showAddressForm = false;
      // open slot popup
      this.showSlotPopup = true;
      this.generateCalendar();
    });
  }


  generateSlots() {

    this.timeSlots = [

      '09:00 AM - 11:00 AM',
      '11:00 AM - 01:00 PM',
      '01:00 PM - 03:00 PM',
      '03:00 PM - 05:00 PM',
      '05:00 PM - 07:00 PM'

    ];

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

  selectDate(day: any) {
    const selected = new Date(this.currentYear, this.currentMonth, day);

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (selected < todayDate) {

      this.slotError = true;
      this.selectedDate = null;
      this.selectedSlot = null;

      return;
    }

    this.slotError = false;
    this.selectedDate = day;
    this.generateSlots();

  }

  selectSlot(slot: any) {
    this.selectedSlot = slot;
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
  
  isPastDate(day: number) {

  const date = new Date(this.currentYear, this.currentMonth, day);
  const today = new Date();

  today.setHours(0,0,0,0);

  return date < today;
}
}