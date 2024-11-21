/* eslint-disable prettier/prettier */
import { IsBoolean, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ObjectIdColumn } from 'typeorm';

export class TaskEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @IsString()
  task: string;

  @IsBoolean()
  completed: boolean;

  @IsString()
  duration: string;
}
