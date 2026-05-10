import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,

    @Inject('LOG_SERVICE')
    private readonly logClient: ClientProxy,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;

    return {
      message: 'User berhasil dibuat',
      data: result,
    };
  }
  async findAll() {
    const result = await this.prisma.user.findMany();

    this.logClient.emit('activity-log', {
      serviceName: 'backend-service',
      action: 'GET_DETAIL_USER',
      endpoint: `/users`,
      method: 'GET',
      response: result,

      createdAt: new Date(),

    });
    return this.prisma.user.findMany();

  }
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const { password, ...result } = user;

    this.logClient.emit('activity-log', {
      serviceName: 'backend-service',

      action: 'GET_DETAIL_USER',

      endpoint: `/users/${id}`,
      method: 'GET',

      payload: {
        userId: id,
      },

      response: result,

      createdAt: new Date(),
    });

    return result;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.refreshToken.deleteMany({
        where: { userId: id },
      });

      const user = await this.prisma.user.delete({
        where: { id },
      });

      return {
        message: "User berhasil dihapus",
        data: {
          name: user.name,
        },
      };
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('User tidak ditemukan');
        }
      }

      throw new InternalServerErrorException(
        err instanceof Error ? err.message : 'Terjadi kesalahan',
      );
    }
  }
}