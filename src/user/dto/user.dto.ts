export class CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export class UserListQuerParams {
  first_name: string;
  last_name: string;
  email: string;
}

export class UpdateUserDto {
  first_name: string;
  last_name: string;
}
