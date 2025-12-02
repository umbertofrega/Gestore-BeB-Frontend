import {Routes} from '@angular/router';

export const routes: Routes = [
  // 5. 404 CATCH-ALL
  { path: '**', redirectTo: '' },
];
