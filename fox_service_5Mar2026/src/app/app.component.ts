import { Component } from '@angular/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend-angular';
  loading: any;

  constructor(private service: ApiService) {
    this.loading = this.service.loading$;
  }
}
