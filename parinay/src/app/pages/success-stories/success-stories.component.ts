import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SuccessStory {
  name: string;
  image: string;
  date: string;
  message: string;
  tags: string[];
}

@Component({
  selector: 'app-success-stories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-stories.component.html',
  styleUrls: ['./success-stories.component.css']
})
export class SuccessStoriesComponent {
  stories: SuccessStory[] = [
    {
      name: 'Ravi & Sneha',
      image: 'https://images.unsplash.com/photo-1501901609772-df0848060b33?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      date: 'Married: Jan 2024',
      message: 'Met through Parinay and tied the knot in 6 months!',
      tags: ['Quick Match', 'Same City']
    },
    {
      name: 'Aman & Isha',
      image: 'https://images.unsplash.com/photo-1497387674890-4ecd2af62493?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      date: 'Engaged: Oct 2023',
      message: 'We connected over our shared values and goals!',
      tags: ['Shared Values', 'Professional']
    },
    {
      name: 'Ritu & Karan',
      image: 'https://images.unsplash.com/photo-1495484861664-98f5976ba520?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      date: 'Married: Dec 2023',
      message: 'Thanks to Parinay, we found each other effortlessly.',
      tags: ['Effortless', 'Verified Profiles']
    },
    {
      name: 'Deepak & Nisha',
      image: 'https://images.unsplash.com/photo-1551963319-13ff32a5acd1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      date: 'Married: Feb 2024',
      message: 'Never imagined meeting my soulmate so smoothly!',
      tags: ['Soulmate', 'Premium Members']
    },
    {
      name: 'Anjali & Vikram',
      image: 'https://images.unsplash.com/photo-1722952908609-4b57e23da1ee?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      date: 'Engaged: Nov 2023',
      message: 'A genuine platform with amazing matches.',
      tags: ['Verified', 'Long Distance']
    },
    {
      name: 'Priya & Rohit',
      image: 'https://images.unsplash.com/photo-1673315849628-f9c98a15a979?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      date: 'Married: Mar 2024',
      message: 'Parinay helped us find love the traditional-modern way!',
      tags: ['Traditional', 'Modern']
    }
  ];
}