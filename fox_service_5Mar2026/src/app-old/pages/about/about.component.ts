import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  pageHtml = '';
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.get('assets/templates/about.html', { responseType: 'text' })
      .subscribe(html => this.pageHtml = html);
  }
}
