import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quick-booking.component.html',
  styleUrls: ['./quick-booking.component.scss']
})
export class QuickBookingComponent {
  bookingForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }
  ngOnInit() {

    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', Validators.email],
      city: ['', Validators.required],
      service: ['', Validators.required]
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