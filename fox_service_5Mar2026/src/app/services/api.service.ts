import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getCityData(): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/city/get');
  }

  getTimeslotData(): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/timeslot/get');
  }

  getBrandsdata(city_id: any): Observable<any> {
    let url = "https://www.foxservice.in/admin/api/brand/get?city_id=" + city_id;
    return this.http.get<any>(url);
  }

  getTestimonialData(city_id: any): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/testimonial/get?city_id=' + city_id);
  }

  getFooterData(city_id: any): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/footer/get?city_id=' + city_id);
  }

  getBikeData(model: any, cityName: any): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/getServicesByCategory?category_slug=' + model + '&city_slug=' + cityName);
  }

  getSubcategoriesData(city_id: any): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/city/categories?city_id=' + city_id);
  }

  getSubcategoriesBikeData(model: any, cityName: any): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/getSubCategoriesByCategory?category_slug=' + model + '&city_slug=' + cityName);
  }
  
  onQuickBookingSubmit(model: any, cityName: any): Observable<any> {
    
    const payload = {
      phone: model.phone,
      city_id: cityName,
      email: model.email,
      name: model.name
    };
    
    return this.http.post<any>(
      'https://www.foxservice.in/admin/api/order/quick-booking',
      payload
    );
  }
  
  sendOtp(model: any): Observable<any> {
    const payload = {
      phone: '91' + model,
    };
    return this.http.post<any>(
      'https://www.foxservice.in/admin/api/send-otp',
      payload
    );
  }
  
  onRegister(formData: FormData): Observable<any> {
    return this.http.post<any>(
      'https://www.foxservice.in/admin/api/partner/store',
      formData
    );
  }

  getTermsConditionsData(): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/cms/terms_and_conditions');
  }


  // {phone: "918768676765", otp: 1234}

  login(payload:any): Observable<any> {
    return this.http.post<any>('https://www.foxservice.in/admin/api/login',payload);
  }
   
  getCartData(): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/cart/get');
  }

  getOrderData(): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/order/get');
  }
}
