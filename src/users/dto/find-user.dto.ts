/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

/* eslint-disable prettier/prettier */
export class FindUserDto {
  @IsOptional()
  _id?: ObjectId;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
