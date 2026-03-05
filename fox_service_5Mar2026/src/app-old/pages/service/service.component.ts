import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent {

  services = [
    { title: 'General Service', img: '/assets/images/mechanic.jpg', price: 499 },
    { title: 'Oil Change', img: '/assets/images/oilchange.jpg', price: 299 },
    { title: 'Tyre Change', img: '/assets/images/hand.png', price: 399 },
    { title: 'Battery Check', img: '/assets/images/how1.jpg', price: 199 },
    { title: 'Engine Repair', img: '/assets/images/how2.jpg', price: 999 },
    { title: 'Brake Service', img: '/assets/images/how3.jpg', price: 599 }
  ];

}