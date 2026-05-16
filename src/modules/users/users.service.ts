import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';

// MongoDB uchun keladigan ma'lumotlar tipini aniqlashtiramiz
interface IUserMongo {
  name?: string;
  email?: string;
  password?: string;
}

@Injectable()
export class UsersService {
  constructor(
    // 1. PostgreSQL Repozitoriyasi
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // 2. MongoDB Modeli (InjectModel yordamida)
    @InjectModel('UserMongo')
    private readonly mongoUserModel: Model<IUserMongo>,
  ) {}

  // CREATE
  async create(data: Partial<User>) {
    // PostgreSQL-ga saqlash
    const user = this.userRepository.create(data);
    const savedPgUser = await this.userRepository.save(user);

    // MongoDB-ga nusxasini saqlash
    await this.mongoUserModel.create({
      name: savedPgUser.name,
      email: savedPgUser.email,
      password: data.password,
    });

    return savedPgUser;
  }

  // GET ALL
  findAll() {
    return this.userRepository.find();
  }

  // GET ONE
  async findOne(id: number | string) {
    const whereCondition = { id } as FindOptionsWhere<User>;
    const user = await this.userRepository.findOneBy(whereCondition);

    if (!user) {
      throw new NotFoundException('User not found in PostgreSQL');
    }

    return user;
  }

  // UPDATE
  async update(id: number | string, data: Partial<User>) {
    const user = await this.findOne(id);
    const oldEmail = user.email;

    Object.assign(user, data);
    const updatedPgUser = await this.userRepository.save(user);

    // MongoDB'da ham ma'lumotni yangilash
    await this.mongoUserModel.updateOne(
      { email: oldEmail },
      { $set: { name: updatedPgUser.name, email: updatedPgUser.email } },
    );

    return updatedPgUser;
  }

  // DELETE
  async remove(id: number | string) {
    const user = await this.findOne(id);
    const emailToDelete = user.email;

    const removedUser = await this.userRepository.remove(user);

    // MongoDB'dan ham o'chirish
    await this.mongoUserModel.deleteOne({ email: emailToDelete });

    return removedUser;
  }
}
