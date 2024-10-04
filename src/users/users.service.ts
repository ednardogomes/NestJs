/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
      throw new ConflictException(`Usuário já cadastrado.!`);
    }

    try {
      const newUserDb = new UserEntity();
      newUserDb.name = createUser.name;
      newUserDb.surname = createUser.surname;
      newUserDb.email = createUser.email;
      newUserDb.password = bcryptHashSync(createUser.password, 10);

      await this.userRepository.save(newUserDb);

      return 'Usuário cadastrado com sucesso.!';
    } catch (error) {
      throw new BadRequestException(
        `Erro ao cadastrar usuário${error.message}`,
      );
    }
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

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    try {
      const userFoundEmail = await this.userRepository.findOne({
        where: { email: email },
      });

      if (userFoundEmail) {
        delete userFoundEmail.name;
        delete userFoundEmail.surname;
        return { ...userFoundEmail };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateUser: UpdateUserDto): Promise<string> {
    let clientID: ObjectId;
    try {
      clientID = new ObjectId(id);
      const foundUser = await this.userRepository.findOne({
        where: { _id: clientID },
      });

      if (!foundUser) {
        throw new NotFoundException(`Usuário não encontrado`);
      }

      updateUser.password = bcryptHashSync(foundUser.password, 10);
      const updatedUser = await this.userRepository.update(
        clientID,
        updateUser,
      );

      if (updatedUser.affected > 0) {
        return 'Dados atualizado com sucesso';
      }
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async remove(id: string) {
    let clientID: ObjectId;
    try {
      clientID = new ObjectId(id);
      const foundUser = await this.userRepository.findOne({
        where: { _id: clientID },
      });
      if (!foundUser) {
        throw new NotFoundException('Usuário não encontrado');
      }
      await this.userRepository.delete(clientID);
      return `Usuário deletado com sucesso`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
