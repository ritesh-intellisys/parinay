import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ Required for ngClass
import { RouterModule } from '@angular/router';  // ✅ For routerLink

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],  // ✅ Add CommonModule here
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
