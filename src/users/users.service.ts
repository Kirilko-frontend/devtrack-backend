import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import bcrypt from 'bcrypt';

import { UsersCreateDto, UsersResponseDto, UsersUpdateDto } from './dto';
import { UsersSelect } from './prisma/selects/users-select';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UsersResponseDto[]> {
    const users = await this.prisma.user.findMany({
      select: UsersSelect,
    });

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  async create(data: UsersCreateDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findOne(id: number): Promise<UsersResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: UsersSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, data: UsersUpdateDto) {
    const updateData = {
      ...data,
    };

    if (data.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateData,
    });
  }

  async delete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.interview.deleteMany({
      where: {
        vacancy: {
          userId: id,
        },
      },
    });

    await this.prisma.vacancy.deleteMany({
      where: {
        userId: id,
      },
    });

    await this.prisma.resume.deleteMany({
      where: {
        userId: id,
      },
    });

    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
