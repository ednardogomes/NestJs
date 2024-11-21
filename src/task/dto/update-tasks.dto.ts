/* eslint-disable prettier/prettier */
import { IsBoolean, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  _id: string;

  @IsBoolean()
  Completed: boolean;
}
