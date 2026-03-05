import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {

  currentIndex = 0;

  testimonials = [
    {
      initial: 'P',
      title: 'Best Bike Service',
      message: 'Fox Service is the best bike service and repairing centre in this designated area. They do the job in a very short span of time. Amazing service and good communication between customers.',
      name: 'Prateek Agrawal'
    },
    {
      initial: 'A',
      title: 'Excellent Support',
      message: 'Very professional staff and quick response. Mechanic arrived on time and service quality was excellent.',
      name: 'Amit Verma'
    },
    {
      initial: 'R',
      title: 'Trusted Service',
      message: 'Highly recommended bike service. Transparent pricing and very friendly staff.',
      name: 'Rohit Sharma'
    }
  ];

  ngOnInit() {
    setInterval(() => {
      this.next();
    }, 4000);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  goToSlide(i: number) {
    this.currentIndex = i;
  }
}