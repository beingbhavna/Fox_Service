import { Routes } from '@angular/router';
import { CartComponent } from './pages/cart/cart.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { ServiceComponent } from './pages/service/service.component';
import { HomeComponent } from './pages/home/home.component';
import { CityComponent } from './pages/city/city.component';
import { QuickBookingComponent } from './pages/quick-booking/quick-booking.component';
import { LoginComponent } from './pages/login/login.component';
import { BikeDetailComponent } from './pages/bike-detail/bike-detail.component';
import { ProfessionalRegisterComponent } from './pages/professional-register/professional-register.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrdersComponent } from './pages/orders/orders.component';

// export const routes: Routes = [
// 	{ path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
// 	{ path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
// 	{ path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
// 	{ path: 'service', loadComponent: () => import('./pages/service/service.component').then(m => m.ServiceComponent) },
// 	{ path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
// 	{ path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
// 	{ path: 'orders', loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent) },
// 	{ path: 'faq', loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent) },
// 	{ path: 'terms', loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent) },
// 	{ path: 'become-partner', loadComponent: () => import('./pages/become-partner/become-partner.component').then(m => m.BecomePartnerComponent) },
// 	{ path: '**', redirectTo: '' }
// ];

export const routes: Routes = [
  { path: '', redirectTo: 'city/noida', pathMatch: 'full' },
  { path: 'city/:cityName', component: HomeComponent },
  { path: 'service', component: ServiceComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'cart', component: CartComponent },
  { path: 'city/:name', component: CityComponent },
  { path: 'quick-booking', component: QuickBookingComponent },
  { path: 'bike-scooty/:model', loadComponent: () => import('./pages/bike-list/bike-list.component').then(m => m.BikeListComponent) },
  { path: 'login', component: LoginComponent },
  { path: 'bikeDetail/:model', component: BikeDetailComponent },
  { path: 'register-as-a-professional', component: ProfessionalRegisterComponent },
];
