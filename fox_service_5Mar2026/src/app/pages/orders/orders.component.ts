import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  ordersData: any[] = [];
  expandedIndex: number | null = null;
  successMessage: any;
  showSuccess: boolean = false;
  showError: boolean = false;
  errorMessage: any;
  showSlotPopup: boolean = false;
  selectedDate: any;
  currentDate = new Date();
  currentMonth!: number;
  currentYear!: number;
  calendarDays: number[] = [];
  filteredSlots: any[] = [];
  selectedSlot: any;
  timeSlots: any;
  showCancelModal = false;
  cancelReason = '';
  selectedOrder: any;

  daysName = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getOrderData();
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.selectedDate = new Date().getDate();
  }

  toggleOrder(i: number) {
    this.expandedIndex = this.expandedIndex === i ? null : i;
  }

  getStatusStep(status: string) {
    switch (status) {
      case 'Processing': return 1;
      case 'Rescheduled': return 2;
      case 'In Progress': return 3;
      case 'Completed': return 4;
      default: return 1;
    }
  }
  openWhatsApp() {
    window.open('https://api.whatsapp.com/send?phone=918889998382&text=Hello,%20I%20have%20a%20question%20about', '_blank');
  }

  getOrderData() {
    this.apiService.getOrderData().subscribe({
      next: (data) => {
        console.log('orders:', data);
        this.ordersData = data.orders || [];
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }

  rescheduleOrder(order: any) {
    this.showSlotPopup = true;
    this.generateCalendar();
  }

  closeError() {
    this.showSuccess = false;
    this.showError = false;
  }


  // timeslot code

  getTimeslotData() {
    this.apiService.getTimeslotData().subscribe({
      next: (data) => {
        console.log('Timeslots data:', data);
        this.timeSlots = data.slots || [];
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
      }
    });
  }
  confirmSlot() {
    const payload = {
      date: this.selectedDate,
      slot: this.selectedSlot
    };
    console.log("Slot Payload:", payload);
  }

  generateCalendar() {
    this.getTimeslotData();
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.calendarDays = [];
    for (let i = 1; i <= days; i++) {
      this.calendarDays.push(i);
    }
    const today = new Date();
    if (this.selectedDate === today.getDate() && this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear()) {
      this.filterSlots();
      // this.getCartData();
    } else {
      this.filteredSlots = this.timeSlots;
    }
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  selectDate(day: number) {
    this.selectedDate = day;
    const today = new Date();
    if (day === today.getDate()) {
      this.filterSlots();
    } else {
      this.filteredSlots = this.timeSlots;
    }
  }

  selectSlot(slot: any) {
    this.selectedSlot = slot;

    console.log("Selected Slot ID:", slot.id);
    console.log("Selected Slot:", slot);
  }

  isPastDate(day: number) {
    const date = new Date(this.currentYear, this.currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  filterSlots() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    this.filteredSlots = this.timeSlots.filter((slot: any) => {
      const [hour, minute] = slot.start_time.split(':').map(Number);
      const slotMinutes = hour * 60 + minute;
      return slotMinutes > currentMinutes;
    });
  }

  submit() {
    const payload = {
      "id": this.ordersData[0].order.id,
      "date": `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(this.selectedDate).padStart(2, '0')}`,
      "time_slot_id": this.selectedSlot.id
    }
    this.apiService.reschedule(payload).subscribe({
      next: (data) => {
        console.log('orders:', data);
        this.successMessage = data.message || 'Your order has been placed successfully';
        // Your order has been placed successfully
        this.showSlotPopup = false;
        this.showSuccess = true;
        this.showError = false;
        this.getOrderData();
      },
      error: (error) => {
        console.error('Error fetching subcategories data:', error);
        this.errorMessage = error?.error?.message || "Something went wrong";
        this.showError = true;
        this.showSuccess = false;
      }
    });
  }

  close() {
    this.showSlotPopup = false;
  }

  getThreeSpecs(specHtml: string): string {
    return specHtml.split('</p>').slice(0, 3).join('</p>');
  }

  cancelOrder(order: any) {
    this.selectedOrder = order;
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
  }

  confirmCancel() {
    const payload = {
      id: this.selectedOrder.order.id,
      reason: this.cancelReason
    };
    this.apiService.cancelOrder(payload).subscribe({
      next: (res) => {
        this.getOrderData();
        this.successMessage = res.message;
        this.showSuccess = true;
      }, error: (err) => {
        this.errorMessage = err.message;
        this.showCancelModal = true;
      }
    })
    console.log(payload);

    this.showCancelModal = false;

  }
}

