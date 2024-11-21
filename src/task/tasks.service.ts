/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';
import { TaskEntity } from './entities/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const newTaskDb = new TaskEntity();
      newTaskDb.task = createTaskDto.task;
      newTaskDb.completed = createTaskDto.completed;
      newTaskDb.duration = createTaskDto.duration;

      await this.taskRepository.save(newTaskDb);

      return 'Tarefa criada com sucesso';
    } catch (error) {
      throw new BadRequestException(`Erro ao criar tarefa ${error.message}`);
    }
  }

  async findAll() {
    return this.taskRepository.find();
  }

  async findOne(id: string) {
    let taskID: ObjectId;
    try {
      taskID = new ObjectId(id);
    } catch (error) {
      throw new BadRequestException(`ID Inválido${error.message}`);
    }

    const foundTask = await this.taskRepository.findOne({
      where: { _id: taskID },
    });

    if (!foundTask) {
      throw new NotFoundException('Tarefa não encontrada');
    }
    return foundTask;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<string> {
    let taskID: ObjectId;
    try {
      taskID = new ObjectId(id);
    } catch (error) {
      throw new BadRequestException(`ID Inválido${error.message}`);
    }

    const foundTask = await this.taskRepository.findOne({
      where: { _id: taskID },
    });

    if (!foundTask) {
      throw new NotFoundException(`Usuário não encontrado`);
    }

    const updateTask = await this.taskRepository.update(taskID, updateTaskDto);

    if (updateTask.affected > 0) {
      return `Tarefa atualizada com sucesso`;
    }
  }

  async remove(id: string) {
    let taskID: ObjectId;
    try {
      taskID = new ObjectId(id);
      const foundTask = await this.taskRepository.findOne({
        where: { _id: taskID },
      });

      if (!foundTask) {
        throw new NotFoundException(`Usuário não encontrado`);
      }

      await this.taskRepository.delete(taskID);

      return `Tarefa deletada com sucesso`;
    } catch (error) {
      throw new BadRequestException(`ID Inválido${error.message}`);
    }
  }
}
