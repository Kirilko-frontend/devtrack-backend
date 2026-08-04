import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { UserCreateDto, UserResponseDto, UserUpdateDto } from './dto';
import { UserSelect } from './prisma/user-select';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      select: UserSelect,
    });

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  async create(data: UserCreateDto) {
    const user = await this.prisma.user.create({
      data,
    });
    return user;
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: UserSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, data: UserUpdateDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
