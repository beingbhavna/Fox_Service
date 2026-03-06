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
  
  openWhatsApp() {
    window.open('https://api.whatsapp.com/send?phone=918889998382&text=Hello,%20I%20have%20a%20question%20about', '_blank');
  }
}
