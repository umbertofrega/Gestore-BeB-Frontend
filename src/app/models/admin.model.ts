import { AdminRole } from './enums/admin-role.model';
import {User} from './user.model';

export interface Admin extends User {
  role: AdminRole;
}
