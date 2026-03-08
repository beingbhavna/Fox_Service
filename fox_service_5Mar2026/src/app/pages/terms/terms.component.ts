import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  pageHtml = '';
  termsConditions: any;
  constructor(private http: HttpClient,private service: ApiService,private sanitizer: DomSanitizer) {}
  ngOnInit(): void {
    this.getTermsConditionsData();
  }

    getTermsConditionsData() {
    this.service.getTermsConditionsData().subscribe({
      next: (data) => {
        this.termsConditions = data.terms_and_conditions || [];
      },
      error: (error) => {
        console.error('Error fetching terms and conditions data:', error);
      }
    });
  }

   getSafeDescription(desc: string): SafeHtml {
      return this.sanitizer.bypassSecurityTrustHtml(desc);
    }
}
