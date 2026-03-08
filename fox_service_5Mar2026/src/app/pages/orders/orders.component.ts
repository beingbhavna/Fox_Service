import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  pageHtml = '';
  constructor(private http: HttpClient) {}

  orders = [

{
service:'Standard Service',
bike:'Royal Enfield Bullet 350',
price:1599,
date:'12 May 2025',
status:'completed'
},

{
service:'Washing',
bike:'Suzuki Intruder',
price:70,
date:'10 May 2025',
status:'pending'
},

{
service:'Basic Service',
bike:'Pulsar 150',
price:699,
date:'08 May 2025',
status:'cancelled'
}

];


  ngOnInit(): void {
    this.http.get('assets/templates/orders.html', { responseType: 'text' })
      .subscribe(html => this.pageHtml = html);
  }
}
