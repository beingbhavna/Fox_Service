import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule, HeaderComponent],
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

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
    this.selectedCity = this.cartItems.length > 0 ? this.cartItems[0].cities[0].name : '';
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
}