/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  password: string;
}
