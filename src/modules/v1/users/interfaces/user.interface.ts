import { User } from '../schemas/user.schema';
import { Refresh } from '../../auth/schemas/refresh.schema';

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface CreatedUserPayload {
  message: string;
  data: {
    user: User;
    refresh: Refresh;
  };
}
