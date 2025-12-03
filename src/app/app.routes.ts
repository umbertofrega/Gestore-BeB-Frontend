import { Routes } from '@angular/router';
import {Home} from './components/home/home';
import {RoomDetail} from './components/room-detail/room-detail'; // Importa il componente!

export const routes: Routes = [
  // 1. Rotta Home (path vuoto)
  { path: '', component: Home },

  { path: 'room/:number', component : RoomDetail },

  // 2. Rotta Catch-All (Wildcard) -> Va messa ALLA FINE
  { path: '**', redirectTo: '' }
];
