import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserListQuerParams,
} from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(CreateUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: CreateUserDto });
    return user;
  }

  async findAll(query: UserListQuerParams) {
    const user = await this.prisma.user.findMany();
    return user;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('No User found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('No User Found');
    }
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        first_name: updateUserDto.first_name,
        last_name: updateUserDto.last_name,
      },
    });
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      created_at: updatedUser.created_at,
      updated_at: new Date(),
    };
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (user) {
      return this.prisma.user.delete({ where: { id: id } });
    } else {
      throw new NotFoundException('No User Found');
    }
  }
}
