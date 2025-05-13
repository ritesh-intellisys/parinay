import { Component } from '@angular/core';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent {
  faqs = [
    {
      question: 'How do I register on Parinay?',
      answer: 'Getting started is easy! Click the "Register" button at the top of any page, fill in your basic details, and complete our 5-step profile setup process. You\'ll be guided through each step with clear instructions. Our team manually reviews each profile within 24 hours for authenticity before activation.',
      isOpen: false
    },
    {
      question: 'Are all profiles verified?',
      answer: 'Yes, every profile undergoes our comprehensive 5-step verification process: Email and mobile number verification, Photo ID authentication, Manual profile review by our team, AI-powered fraud detection, and Ongoing activity monitoring.',
      isOpen: false
    },
    {
      question: 'How does your matching algorithm work?',
      answer: 'Our proprietary matching system analyzes over 50 compatibility factors across 5 key dimensions: Core Values (religion, family values, life goals), Lifestyle (hobbies, dietary preferences, habits), Personality (traits, communication style, temperament), and Background (education, profession, family details). The algorithm continuously learns from successful matches to improve recommendations.',
      isOpen: false
    },
    {
      question: 'What safety features do you offer?',
      answer: 'Your safety is our top priority. We offer multiple layers of protection: Controlled communication through our secure messaging system, Option to hide personal contact details until ready, 24/7 moderation team monitoring all interactions, Instant reporting system for suspicious activity, Photo protection with watermarks and download prevention, and Dedicated safety resources and guidance.',
      isOpen: false
    }
  ];

  toggleFAQ(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}