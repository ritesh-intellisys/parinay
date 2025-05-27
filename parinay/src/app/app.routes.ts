import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faqs', component: FaqsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'subscription',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/plans/subscription.component').then(m => m.SubscriptionComponent),
  },
  {
    path: 'search',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/search/search.component').then(m => m.SearchComponent),
  },
  {
    path: 'success-stories',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/success-stories/success-stories.component').then(m => m.SuccessStoriesComponent),
  },
  {
    path: 'profiles',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/profile-editor/profile-editor.component').then(m => m.ProfileEditComponent),
  },
  { 
    path: 'my-profile', 
    loadComponent: () => import('./pages/my-profile/my-profile.component').then(m => m.MyProfileComponent),
    // canActivate: [AuthGuard]
  }
];
