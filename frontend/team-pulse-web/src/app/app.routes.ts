import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './login/login';
import { StandupComponent } from './standup/standup';
import { SignupComponent } from './signup/signup';
import { PRReviewComponent } from './prreview/prreview';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'standup', component: StandupComponent, canActivate: [AuthGuard] },
  { path: 'pr-review', component: PRReviewComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
