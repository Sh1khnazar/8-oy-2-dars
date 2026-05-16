import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // CREATE
  @Post()
  create(@Body() body: Partial<User>) {
    return this.usersService.create(body);
  }

  // GET ALL
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<User>) {
    return this.usersService.update(id, body);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
