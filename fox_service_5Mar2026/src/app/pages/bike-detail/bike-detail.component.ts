import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-bike-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './bike-detail.component.html',
  styleUrl: './bike-detail.component.scss'
})
export class BikeDetailComponent {
  model: any;
  bikeData: any;
  services: any;
  constructor(public cartService: CartService, private service: ApiService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.route.paramMap.subscribe(params => {
      this.model = params.get('model');
    });
  }
  quantity = 1;
  showPopup = false;
  selectedService: any = null;

  // services = [
  //   {
  //     name: 'Fault Inspection',
  //     price: 699,
  //     image: 'assets/images/fault.jpg',
  //     includes: [
  //       'Wash: Deep hand Cleaning.',
  //       'Engine oil: Change.',
  //       'Air filter: Basic Cleaning.',
  //       'Fuel filter: Check free flow.',
  //       'Spark Plug: Cleaning & gap adjust.',
  //       'Brake front & rear: Adjust and greasing.',
  //       'Clutch: Check tightness & oiling.',
  //       'Drive Chain: Cleaning & slack check.',
  //       'Battery: Top up if necessary.',
  //       'Coolant: Top up if necessary.',
  //       'Control cables: Adjust if required.',
  //       'Sanitization: Bike sanitization process.'
  //     ]
  //   },
  //   {
  //     name: 'Basic Service',
  //     price: 349,
  //     image: 'assets/images/basicservice.jpg',
  //     includes: [
  //       'Engine oil check',
  //       'Brake check',
  //       'Chain lubrication',
  //       'Air filter cleaning'
  //     ]
  //   },
  //   {
  //     name: 'Standard Service',
  //     price: 699,
  //     image: 'assets/images/standardservice.jpg',
  //     includes: [
  //       'Wash: Deep hand Cleaning.',
  //       'Engine oil: Change.',
  //       'Air filter: Basic Cleaning.',
  //       'Fuel filter: Check free flow.',
  //       'Spark Plug: Cleaning & gap adjust.',
  //       'Brake front & rear: Adjust and greasing.',
  //       'Clutch: Check tightness & oiling.',
  //       'Drive Chain: Cleaning & slack check.',
  //       'Battery: Top up if necessary.',
  //       'Coolant: Top up if necessary.',
  //       'Control cables: Adjust if required.',
  //       'Sanitization: Bike sanitization process.'
  //     ]
  //   },
  //   {
  //     name: 'Washing',
  //     price: 70,
  //     image: 'assets/images/washing.jpg',
  //     includes: [
  //       'Full bike wash',
  //       'Dry cleaning',
  //       'Polish'
  //     ]
  //   }
  // ];

  ngOnInit() {
    this.getBikeData();
  }
  openPopup(service: any) {
    this.selectedService = service;
    this.showPopup = true;
    document.body.style.overflow = 'hidden';
  }

  closePopup() {
    this.showPopup = false;
    document.body.style.overflow = 'auto';
  }

  addToCart(service: any) {
    this.cartService.addToCart(service, this.model);
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getBikeData() {
    let cityName = JSON.parse(localStorage.getItem('cityId') || '{}').slug;
    this.service.getBikeData(this.model, cityName).subscribe((response: any) => {
      this.bikeData = response.category;
      this.services = response.services;
    });
  }

  getSafeDescription(desc: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(desc);
  }
  // addToCart() {
  //   console.log('Added to cart with quantity:', this.quantity);
  // }

  // goBack() {
  //   this.router.navigate(['../'], { relativeTo: this.route });
  // }
}
