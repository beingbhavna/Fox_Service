import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bike-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bike-list.component.html',
  styleUrl: './bike-list.component.scss'
})
export class BikeListComponent {
  constructor(private router: Router) {}

   activeBrand: string = 'All';

  brands = ['All','Honda','TVS','Bajaj','Hero','Yamaha','Suzuki','KTM','Other'];

  bikes = [
    { name: 'Honda Activa 6G', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda SP 125', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda CB Shine', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda Activa 5G', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda CB Shine SP', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda Dio', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda CB Unicorn 150', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda Activa 125', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda Livo', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda Dream Yuga', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda CD 110 Dream', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda Grazia', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda Activa i', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda Dream Neo', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda Aviator', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda Navi', brand: 'Honda', img: 'assets/images/brand1.png' },
    { name: 'Honda Cliq', brand: 'Honda', img: 'assets/images/brand1.png' },

    { name: 'TVS Sport', brand: 'TVS', img: 'assets/bikes/tvs.png' },
    { name: 'TVS Scooty Pep Plus', brand: 'TVS', img: 'assets/bikes/tvs.png' },
    { name: 'TVS Radeon', brand: 'TVS', img: 'assets/bikes/tvs.png' },
    { name: 'TVS Star City Plus', brand: 'TVS', img: 'assets/bikes/tvs.png' },
    { name: 'TVS Scooty Zest 110', brand: 'TVS', img: 'assets/bikes/tvs.png' },
    { name: 'TVS Victor', brand: 'TVS', img: 'assets/bikes/tvs.png' },
    { name: 'TVS Wego', brand: 'TVS', img: 'assets/bikes/tvs.png' },
    { name: 'TVS Ntorq 125', brand: 'TVS', img: 'assets/bikes/tvs.png' },
    { name: 'TVS Jupiter', brand: 'TVS', img: 'assets/bikes/tvs.png' },

    { name: 'Bajaj Pulsar 125', brand: 'Bajaj', img: 'assets/bikes/bajaj.png' },
    { name: 'Bajaj Pulsar 150', brand: 'Bajaj', img: 'assets/bikes/bajaj.png' },
    { name: 'Bajaj Platina 110 H-Gear', brand: 'Bajaj', img: 'assets/bikes/bajaj.png' },
    { name: 'Bajaj CT 110', brand: 'Bajaj', img: 'assets/bikes/bajaj.png' },
    { name: 'Bajaj Platina 100', brand: 'Bajaj', img: 'assets/bikes/bajaj.png' },
    { name: 'Bajaj Avenger 150', brand: 'Bajaj', img: 'assets/bikes/bajaj.png' },
    { name: 'Bajaj Discover 135', brand: 'Bajaj', img: 'assets/bikes/bajaj.png' },

    { name: 'Hero Splendor', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero HF Deluxe', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Splendor Plus i3s', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Glamour', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Splendor Plus', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Passion Pro 110', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Super Splendor', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Glamour FI', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Passion XPro', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Glamour i3s', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Pleasure', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Pleasure+ 110', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Maestro Edge', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Xtreme Sports', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Maestro Edge 125', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Duet', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Destini 125', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Super Splendor 2018', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero HF Deluxe i3s', brand: 'Hero', img: 'assets/bikes/hero.png' },
    { name: 'Hero Splendor iSmart 110', brand: 'Hero', img: 'assets/bikes/hero.png' },

    { name: 'Yamaha Fascino 125', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha Saluto', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha Ray Z', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha FZ S V3', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha FZ V3', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha Fascino', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha Cygnus Ray ZR', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha Saluto RX', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha Alpha', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha Gladiator', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha FZ', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha FZ FI', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha FZS', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha FZS V2', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha FZS FI', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha Libero', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha R15 V2', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha R15 V1', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },
    { name: 'Yamaha Fazer', brand: 'Yamaha', img: 'assets/bikes/yamaha.png' },

    { name: 'Suzuki Access 125', brand: 'Suzuki', img: 'assets/bikes/suzuki.png' },
    { name: 'Suzuki Burgman Street 125', brand: 'Suzuki', img: 'assets/bikes/suzuki.png' },

    { name: 'KTM RC 125', brand: 'KTM', img: 'assets/bikes/ktm.png' },
    { name: 'KTM 125 Duke', brand: 'KTM', img: 'assets/bikes/ktm.png' },
    { name: 'Other Model', brand: 'Other', img: 'assets/images/bike.png' },


  ];

  slides = [
    {
      image: 'assets/images/serviceSlide.jpg',
      title: 'Upto 150cc Service in Noida',
      subtitle: 'Get instant access to reliable and affordable services'
    }
  ];

  get filteredBikes() {
    if (this.activeBrand === 'All') return this.bikes;
    return this.bikes.filter(b => b.brand === this.activeBrand);
  }

  filterBrand(brand: string) {
    this.activeBrand = brand;
  }

  goToDetails(bike: any) {
    this.router.navigate(['/bikeDetail', bike.name]);
  }
}