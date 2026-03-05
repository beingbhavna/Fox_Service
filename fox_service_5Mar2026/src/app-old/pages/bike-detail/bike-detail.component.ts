import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-bike-detail',
  standalone: true,
  imports: [CommonModule,HeaderComponent],
  templateUrl: './bike-detail.component.html',
  styleUrl: './bike-detail.component.scss'
})
export class BikeDetailComponent {
  constructor(public cartService: CartService){}
  quantity = 1;
  showPopup = false;
  selectedService: any = null;

  services = [
    {
      name: 'Fault Inspection',
      price: 699,
      image: 'assets/images/fault.jpg',
      includes: [
        'Wash: Deep hand Cleaning.',
        'Engine oil: Change.',
        'Air filter: Basic Cleaning.',
        'Fuel filter: Check free flow.',
        'Spark Plug: Cleaning & gap adjust.',
        'Brake front & rear: Adjust and greasing.',
        'Clutch: Check tightness & oiling.',
        'Drive Chain: Cleaning & slack check.',
        'Battery: Top up if necessary.',
        'Coolant: Top up if necessary.',
        'Control cables: Adjust if required.',
        'Sanitization: Bike sanitization process.'
      ]
    },
    {
      name: 'Basic Service',
      price: 349,
      image: 'assets/images/basicservice.jpg',
      includes: [
        'Engine oil check',
        'Brake check',
        'Chain lubrication',
        'Air filter cleaning'
      ]
    },
    {
      name: 'Standard Service',
      price: 699,
      image: 'assets/images/standardservice.jpg',
      includes: [
        'Wash: Deep hand Cleaning.',
        'Engine oil: Change.',
        'Air filter: Basic Cleaning.',
        'Fuel filter: Check free flow.',
        'Spark Plug: Cleaning & gap adjust.',
        'Brake front & rear: Adjust and greasing.',
        'Clutch: Check tightness & oiling.',
        'Drive Chain: Cleaning & slack check.',
        'Battery: Top up if necessary.',
        'Coolant: Top up if necessary.',
        'Control cables: Adjust if required.',
        'Sanitization: Bike sanitization process.'
      ]
    },
    {
      name: 'Washing',
      price: 70,
      image: 'assets/images/washing.jpg',
      includes: [
        'Full bike wash',
        'Dry cleaning',
        'Polish'
      ]
    }
  ];

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
    this.cartService.addToCart(service);
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // addToCart() {
  //   console.log('Added to cart with quantity:', this.quantity);
  // }

  // goBack() {
  //   this.router.navigate(['../'], { relativeTo: this.route });
  // }
}
