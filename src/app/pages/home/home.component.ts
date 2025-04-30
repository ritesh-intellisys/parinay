import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // Featured profiles data
  featuredProfiles = [
    {
      name: 'Ankita, 26',
      details: 'Mumbai, Hindu, Architect',
      image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Amit, 31',
      details: 'Pune, Sikh, Doctor',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Neha, 27',
      details: 'Kolkata, Bengali, Teacher',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Arjun, 29',
      details: 'Chennai, Tamil, Entrepreneur',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Sara, 25',
      details: 'Hyderabad, Muslim, Content Writer',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    }
  ];

  // Scroll the featured profile container
  scrollProfiles(direction: 'left' | 'right') {
    const container = document.getElementById('profileScroller');
    if (!container) return;

    const scrollAmount = 300;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

}
