import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-become-partner',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './become-partner.component.html',
  styleUrls: ['./become-partner.component.scss']
})
export class BecomePartnerComponent implements OnInit {
  pageHtml = '';
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.get('assets/templates/become-partner.html', { responseType: 'text' })
      .subscribe(html => this.pageHtml = html);
  }
}
