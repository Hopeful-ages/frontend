import { City } from './city';
import { Service } from './service';

export interface UserType {
  id?: number;
  name: string;
  cpf: string;
  phone: string;
  service: Service;
  city: City;
  accountStatus: boolean;
}

export interface RegisterUser extends UserType {
  password: string;
}

export interface RegisterUserPassword extends RegisterUser {
  confirmPassword: string;
}
