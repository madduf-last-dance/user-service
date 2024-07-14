import { Role } from "../entities/role.enum";

export class CreateUserDto {
  name: string;

  surname: string;

  email: string;

  address: string;

  username: string;

  password: string;

  role: Role;
}
