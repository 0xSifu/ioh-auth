import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { UserCreateDto } from 'src/modules/auth/dtos/auth.signup.dto';
import { UserResponseDto } from '../dtos/user.response.dto';
import { GenericResponseDto } from '../dtos/generic.response.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateUser(
    userId: string,
    data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const { username, email } = data;
    return this.prismaService.user.update({
      data: {
        username,
        email
      },
      where: {
        id: userId,
      },
    });
  }

  async updateLoginInfo(userId: string): Promise<UserResponseDto> {
    return this.prismaService.user.update({
      data: {
        lastLogin: new Date(),
      },
      where: {
        id: userId,
      },
    });
  }

  async createUser(data: UserCreateDto): Promise<UserResponseDto> {
    return this.prismaService.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password
      },
    });
  }

  async getUserById(userId: string): Promise<UserResponseDto> {
    return this.prismaService.user.findUnique({ where: { id: userId } });
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    return this.prismaService.user.findFirst({ where: { email } });
  }

  async softDeleteUsers(userIds: string[]): Promise<GenericResponseDto> {
    await this.prismaService.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        isDelete: true,
      },
    });
    return {
      status: true,
      message: 'userDeleted',
    };
  }

  async deleteUsers(userIds: string[]): Promise<GenericResponseDto> {
    await this.prismaService.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    return {
      status: true,
      message: 'userDeleted',
    };
  }
}