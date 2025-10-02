import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log('Data Base connected');
  }
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }


  findAll() {
    return this.user.findMany();
  }

  findOne(email: string) {
    return this.user.findUnique({
      where: { email },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.user.delete({
      where: { id },
    });
  }

  async getBalance(userId: string) {
    const user = await  this.user.findUnique({
      where: { id : userId },
      select: { balance: true },
    });
    console.log('user', user);
    if(!user) {
      throw new NotFoundException('User not found');
    }
    return  { balance: user.balance , currency: 'USDT'};
  }
}
