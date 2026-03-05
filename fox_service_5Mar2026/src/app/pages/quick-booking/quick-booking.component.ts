import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-quick-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quick-booking.component.html',
  styleUrls: ['./quick-booking.component.scss']
})
export class QuickBookingComponent {
  bookingForm!: FormGroup;
  timeslotList: any;
  cityList: any;

  constructor(private fb: FormBuilder, private router: Router,private service: ApiService) { }
  ngOnInit() {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', Validators.email],
      city: ['', Validators.required],
      service: ['', Validators.required]
    });
    this.getTimeslotList();
    this.getCityList();
  }

   getTimeslotList() {
    this.service.getTimeslotData().subscribe({
      next: (data) => {
        console.log('Timeslot data:', data);
        this.timeslotList = data.timeslots || [];
      },
      error: (error) => {
        console.error('Error fetching timeslot data:', error);
      }
    });
  }

  getCityList(){
    this.service.getCityData().subscribe({
      next: (data) => {
        console.log('City data:', data);
        this.cityList = data.cities || [];
        // this.selectedCity = this.cityList.length > 0 ? this.cityList[0].id : null; // default to first city if available
      },
      error: (error) => {
        console.error('Error fetching city data:', error);
      }
    });
  }

  get f() {
    return this.bookingForm.controls;
  }

  close() {
    this.router.navigate(['/']);
  }

  submit() {
    if (this.bookingForm.invalid) return;
    console.log(this.bookingForm.value);
    alert('Booking submitted!');
    this.close();
  }
}