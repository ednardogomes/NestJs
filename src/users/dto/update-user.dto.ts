/* eslint-disable prettier/prettier */

import { IsString } from 'class-validator';

export class UpdateUserDto{

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  password: string;
}