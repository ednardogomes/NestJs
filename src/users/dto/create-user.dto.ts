/* eslint-disable prettier/prettier */
import { IsEmail, IsString } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
