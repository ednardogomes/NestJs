/* eslint-disable prettier/prettier */

import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @ObjectIdColumn()
  _id: ObjectId

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string

  @Column()
  password: string;

}
