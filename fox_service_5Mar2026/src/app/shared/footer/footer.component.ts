
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  footerData: any;
  constructor(private service: ApiService) { }
  ngOnInit(): void {
    this.getFooterData();
  }

  getFooterData() {
    const cityId = localStorage.getItem('cityId') || '1'; // default to 1 if not set
    this.service.getFooterData((JSON.parse(cityId)).id).subscribe((res) => {
      console.log(res);
      this.footerData = res.footer;
    });
  }
}
