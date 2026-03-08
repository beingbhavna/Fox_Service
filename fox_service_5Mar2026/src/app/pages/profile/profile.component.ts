import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  pageHtml = '';
  cityName: any;
  activeTab: string = 'editProfile';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('assets/templates/profile.html', { responseType: 'text' })
      .subscribe(html => this.pageHtml = html);
  }


  setTab(tab: string) {
    this.activeTab = tab;
  }
}
