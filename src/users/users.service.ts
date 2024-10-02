/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { ObjectId } from 'mongodb';

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

  async findOne(id: string): Promise<UserEntity> {
    let clientID: ObjectId;

    try {
      clientID = new ObjectId(id);
    } catch (error) {
      throw new BadRequestException(`ID inválido${error.message}`);
    }
    const foundUser = await this.userRepository.findOne({
      where: { _id: clientID },
    });
    if (!foundUser) {
      throw new NotFoundException(`Usuário não encontrado`);
    }

    return foundUser;
  }

  async update(id: string, updateUser: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
