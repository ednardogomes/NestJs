/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashSync as bcryptHashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUser: CreateUserDto): Promise<string> {
    const userAlreadyExists = await this.userRepository.findOne({
      where: { email: createUser.email },
    });

    if (userAlreadyExists) {
      throw new HttpException(`Usuário já cadastrado.!`, HttpStatus.CONFLICT);
    }

    const newUserDb = new UserEntity();
    newUserDb.name = createUser.name;
    newUserDb.surname = createUser.surname;
    newUserDb.email = createUser.email;
    newUserDb.password = bcryptHashSync(createUser.password, 10);

    await this.userRepository.save(newUserDb);

    return 'Usuário cadastrado com sucesso.!';
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUser: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
