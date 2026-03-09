import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  activeIndex: number | null = null;

  faqs = [
    {
      question: 'What is FoxService?',
      answer: 'FoxService provides doorstep bike servicing at affordable prices.'
    },
    {
      question: 'How do I book a service?',
      answer: 'You can select your bike model and service type from the website.'
    },
    {
      question: 'Do you provide doorstep service?',
      answer: 'Yes, our mechanic will visit your location.'
    },
    {
      question: 'What cities do you serve?',
      answer: 'Currently available in Bangalore, Delhi NCR and expanding.'
    }
  ];

  ngOnInit(){

  }
  toggleFAQ(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

}
