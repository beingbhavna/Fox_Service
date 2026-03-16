import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
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


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
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

  editAddress() {
    this.addressEdit = true;
    this.apiService.updateAddress('payload').subscribe({
      next:(data)=>{
        this.getProfileData();
      }
    })
  }

  editUserProfile() {
    this.addressEdit = true;
    this.apiService.updateUserProfile('payload').subscribe({
      next:(data)=>{
        this.getProfileData();
      }
    })
  }
}
