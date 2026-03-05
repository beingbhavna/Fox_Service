import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services-grid',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './services-grid.component.html',
  styleUrls: ['./services-grid.component.scss']
})
export class ServicesGridComponent {
  services = [
    { name: 'Upto 150cc', img: 'assets/images/150cc.jpg', link: '/service#bike', button: 'Book Now ->' },
    { name: 'Upto 151 to 250cc', img: 'assets/images/250cc.jpg', link: '/service#car', button: 'Book Now ->' },
    { name: 'Upto 251 to 350cc', img: 'assets/images/350cc.jpg', link: '/service#battery', button: 'Book Now ->' },
    { name: 'Above 350cc', img: 'assets/images/above350cc.jpg', link: '/service#tyre', button: 'Book Now ->' }
  ];
}