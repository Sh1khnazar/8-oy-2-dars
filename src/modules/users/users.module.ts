import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schema } from 'mongoose'; // Mongoose'dan Schema klassini olamiz
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    // 1. PostgreSQL ulanishi
    TypeOrmModule.forFeature([User]),

    // 2. MongoDB ulanishi
    MongooseModule.forFeature([
      {
        name: 'UserMongo',
        schema: new Schema({
          name: { type: String, required: true },
          email: { type: String, required: true },
          password: { type: String, required: true },
        }),
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
