import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  pageHtml = '';
  cityName: any;
  activeTab: string = 'profile';
  profileData: any;
  Addressddata: any;
  cityList: any;
  timeSlots: any;
  orderData: any;
  title: string = 'Mr';
  addressEdit = false;
  addressForm!: FormGroup;
  selectedAddress: any;



  constructor(private apiService: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      name: [''],
      phone: [''],
      road_area_colony: [''],
      city: [''],
      pincode: [''],
      landmark: ['']
    });
    this.getProfileData();
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }


  selectTitle(val: string) {
    this.title = val;
  }

  getProfileData() {
    this.apiService.userProfile().subscribe({
      next: (data) => {
        console.log('orders:', data);
        this.profileData = data.user || [];
        this.getAddress();
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }

  getAddress() {
    this.apiService.getAddress().subscribe({
      next: (data) => {
        console.log('orders:', data);
        this.Addressddata = data.addresses || [];
        this.getCityList();
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }

  getCityList() {
    this.apiService.getCityData().subscribe({
      next: (data) => {
        console.log('City data:', data);
        this.cityList = data.cities || [];
        this.getOrderData();
      },
      error: (error) => {
        console.error('Error fetching city data:', error);
      }
    });
  }

  getOrderData() {
    this.apiService.getOrderData().subscribe({
      next: (data) => {
        console.log('getOrderData data:', data);
        this.orderData = data.orders || [];
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }

  editAddress(address: any) {
    this.addressEdit = true;
    this.selectedAddress = address;

    this.addressForm.patchValue({
      name: address.name,
      phone: address.phone,
      road_area_colony: address.road_area_colony,
      city: address.city?.name,
      pincode: address.pincode,
      landmark: address.landmark
    });
  }

  updateAddress() {
    const payload = {
      id: this.selectedAddress.id,
      ...this.addressForm.value
    };
    this.apiService.updateAddress(payload).subscribe({
      next: (data) => {
        this.addressEdit = false;
        this.getProfileData();
      }
    })
  }

  editUserProfile() {
    this.apiService.updateUserProfile('payload').subscribe({
      next: (data) => {
        this.getProfileData();
      }
    })
  }
}
