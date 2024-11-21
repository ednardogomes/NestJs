/* eslint-disable prettier/prettier */
import { IsBoolean, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  task: string;

  @IsBoolean()
  completed: boolean;

  @IsString()
  duration: string
}
