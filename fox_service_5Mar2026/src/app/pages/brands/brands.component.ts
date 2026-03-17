import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  brandsList: any[] = [];
  brandSlides: any[] = [];   // 👈 divided slides

  currentIndex = 0;
  slides = [0, 1];

  constructor(private service: ApiService) { }

  ngOnInit() {
    this.getBrands();

    setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.brandSlides.length;
  }

  goToSlide(i: number) {
    this.currentIndex = i;
  }

  getBrands() {
    const cityId = localStorage.getItem('cityId') || '1';

    this.service.getBrandsdata((JSON.parse(cityId)).id).subscribe({
      next: (data) => {
        this.brandsList = data.brands || [];
        this.splitBrandsIntoSlides();   // 👈 split equally
        this.service.hide();
      },
      error: (error) => {
        console.error('Error fetching brands data:', error);
      }
    });
  }

  splitBrandsIntoSlides() {
    const half = Math.ceil(this.brandsList.length / 2);

    this.brandSlides = [
      this.brandsList.slice(0, half),
      this.brandsList.slice(half)
    ];

    this.slides = this.brandSlides.map((_, i) => i); // dots sync
  }
}