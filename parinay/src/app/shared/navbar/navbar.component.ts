import { Component, OnInit, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  dropdownOpen = false;
  isLoggedIn = false;
  userDisplayName = '';
  userInitials = '';
  private authSub!: Subscription;

  navLinks = [
    { path: '/', label: 'Home' },
    { path: '/profiles', label: 'Profiles' },
    { path: '/about', label: 'About' },
    { path: '/search', label: 'Search' },
    { path: '/subscription', label: 'Plans', badge: 'New' },
    { path: '/success-stories', label: 'Stories' },
    { path: '/faqs', label: 'FAQs' },
    { path: '/my-profile', label: 'My-profile' },
    { path: '/contact', label: 'Contact' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService.authState$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.userDisplayName = user.displayName || 'User';
        this.userInitials = this.getInitials(this.userDisplayName);
      } else {
        this.userDisplayName = '';
        this.userInitials = '';
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.authService.logout().subscribe();
    this.dropdownOpen = false;
    this.menuOpen = false;
  }

  private getInitials(name: string): string {
    return name.split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }
}