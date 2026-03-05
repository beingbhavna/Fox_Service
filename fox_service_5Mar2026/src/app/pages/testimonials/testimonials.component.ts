import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
  testimonials: any;
  constructor(private service: ApiService,private sanitizer: DomSanitizer) { }
  currentIndex = 0;

  ngOnInit() {
    this.getTestimonials();
    setInterval(() => {
      this.next();
    }, 4000);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

   getSafeDescription(desc: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(desc);
  }
  
  goToSlide(i: number) {
    this.currentIndex = i;
  }

  getTestimonials() {
    const cityId = localStorage.getItem('cityId') || '1'; // default to 1 if not set
    this.service.getTestimonialData((JSON.parse(cityId)).id).subscribe({
      next: (data) => {
        console.log('Testimonials data:', data);
        this.testimonials = data.testimonials.data || [];
      },
      error: (error) => {
        console.error('Error fetching testimonials data:', error);
      }
    });
  }
}