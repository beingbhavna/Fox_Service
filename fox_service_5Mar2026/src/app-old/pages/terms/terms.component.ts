import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  pageHtml = '';
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.get('assets/templates/terms.html', { responseType: 'text' })
      .subscribe(html => this.pageHtml = html);
  }
}
