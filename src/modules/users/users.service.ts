import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // CREATE
  async create(data: Partial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  // GET ALL
  findAll() {
    return this.userRepository.find();
  }

  // GET ONE
  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // UPDATE
  async update(id: string, data: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  // DELETE
  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
