import { Routes } from '@angular/router';
import {Home} from './components/home/home';
import {RoomDetail} from './components/room-detail/room-detail';
import {AuthGuard} from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'room/:number', component : RoomDetail, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];
