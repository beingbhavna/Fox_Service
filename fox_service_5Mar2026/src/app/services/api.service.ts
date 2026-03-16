import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  show() {
    this.loading.next(true);
  }

  hide() {
    this.loading.next(false);
  }

  getCityData(): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/city/get');
  }

  getSettingsData(city_id: any): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/cms/settings?city_id=' + city_id);
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

  onQuickBookingSubmit(model: any): Observable<any> {

    return this.http.post<any>(
      'https://www.foxservice.in/admin/api/order/quick-booking',
      model
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
    return this.http.post<any>('https://www.foxservice.in/admin/api/partner/store', formData);
  }

  saveAddress(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>('https://www.foxservice.in/admin/api/user/addAddress', formData, { headers });
  }

  payment(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>('https://www.foxservice.in/admin/api/order/checkout', formData, { headers });
  }

  getTermsConditionsData(): Observable<any> {
    return this.http.get<any>('https://www.foxservice.in/admin/api/cms/terms_and_conditions');
  }

  login(payload: any): Observable<any> {
    return this.http.post<any>('https://www.foxservice.in/admin/api/login', payload);
  }

  getCartData(): Observable<any> {
    const token = localStorage.getItem('token'); // get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>('https://www.foxservice.in/admin/api/cart/get', { headers });
  }

  getOrderData(): Observable<any> {
    const token = localStorage.getItem('token'); // get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>('https://www.foxservice.in/admin/api/order/get', { headers });
  }

  userProfile(): Observable<any> {
    const token = localStorage.getItem('token'); // get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>('https://www.foxservice.in/admin/api/user/profile', { headers });
  }

  getAddress(): Observable<any> {
    const token = localStorage.getItem('token'); // get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>('https://www.foxservice.in/admin/api/user/getAddresses', { headers });
  }

  reschedule(payload: any): Observable<any> {
    const token = localStorage.getItem('token'); // get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>('https://www.foxservice.in/admin/api/order/reschedule', payload, { headers });
  }

  cancelOrder(payload: any): Observable<any> {
    const token = localStorage.getItem('token'); // get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>('https://www.foxservice.in/admin/api/order/cancel', payload, { headers });
  }

  addItemsToCart(payload: any): Observable<any> {
    const token = localStorage.getItem('token'); // get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>('https://www.foxservice.in/admin/api/cart/addItemToCart', payload, { headers });
  }

  updateUserProfile(payload: any): Observable<any> {
    //     gender:1,
    // email:test@gmail.com,
    // id:9139
    // name:bhavna
    // phone:917686786786
    // status:Active
    const token = localStorage.getItem('token'); // get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>('https://www.foxservice.in/admin/api/user/update', payload, { headers });
  }

  updateAddress(payload: any): Observable<any> {
    //     {
    //     "id": 7217,
    //     "user_id": 9139,
    //     "type": "Home",
    //     "pincode": "201301",
    //     "house_building_name": "noida",
    //     "road_area_colony": "Noida, Uttar Pradesh, India",
    //     "city_id": 1,
    //     "landmark": "uyu",
    //     "lat": "28.5355161",
    //     "lng": "77.3910265",
    //     "name": "vendor_admin",
    //     "phone": "917686786786",
    //     "email": "bhavnasharma52134@gmail.com",
    //     "created_at": "2026-03-16 17:05:38",
    //     "updated_at": "2026-03-16 17:05:38",
    //     "city": {
    //         "id": 1,
    //         "slug": "noida",
    //         "name": "Noida",
    //         "image": "uploads/cities/GuYzxLDNPWXeTK4K.png",
    //         "lat": "28.4595000",
    //         "lng": "77.0266000",
    //         "created_at": "2020-01-28 18:29:51",
    //         "updated_at": "2020-08-26 04:32:43",
    //         "deleted_at": null
    //     },
    //     "address_id": 7217
    // }
    const token = localStorage.getItem('token'); // get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>('https://www.foxservice.in/admin/api/user/updateAddress', payload, { headers });
  }
}
