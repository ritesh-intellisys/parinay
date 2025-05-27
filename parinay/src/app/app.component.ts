import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component'; // Import the navbar component
import { FooterComponent } from './shared/footer/footer.component'; // Import the footer component
import { CommonModule } from '@angular/common'; // Import CommonModule if needed

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent], // Added CommonModule to imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected from styleUrl to styleUrls
})
export class AppComponent {
  title = 'parinay';
}
