import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  pageHtml = '';
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.get('assets/templates/faq.html', { responseType: 'text' })
      .subscribe(html => this.pageHtml = html);
  }
}
