import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { UserCreateDto } from 'src/modules/auth/dtos/auth.signup.dto';
import { UserResponseDto } from '../dtos/user.response.dto';
import { GenericResponseDto } from '../dtos/generic.response.dto';
import { Prisma } from '@prisma/client';

type PrismaUser = Prisma.UserGetPayload<{}>;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prismaService: PrismaService) {}

  private mapToUserResponseDto(user: PrismaUser): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      lastLogin: user.lastLogin,
      isActive: user.isActive,
      isDelete: user.isDelete,
      ipAddress: user.ipAddress,
      log: user.log,
      isAccountAdmin: user.is_account_admin,
      isAdmin: user.is_admin,
      userStatus: user.userStatus,
      userLanguage: user.userLanguage,
    };
  }

  async updateUser(
    userId: string,
    data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const { username, email } = data;

    const updatedUser = await this.prismaService.user.update({
      data: {
        username,
        email,
      },
      where: {
        id: userId,
      },
    });

    return this.mapToUserResponseDto(updatedUser);
  }

  async updateLoginInfo(userId: string): Promise<UserResponseDto> {
    const updatedUser = await this.prismaService.user.update({
      data: {
        lastLogin: new Date(),
      },
      where: {
        id: userId,
      },
    });

    return this.mapToUserResponseDto(updatedUser);
  }

  async createUser(data: UserCreateDto): Promise<UserResponseDto> {
    const newUser = await this.prismaService.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        is_account_admin: data.is_account_admin ?? false,
        is_admin: data.is_admin ?? false,
        userLanguage: data.userLanguage ?? 'en',
        userStatus: data.userStatus ?? 'ACTIVE',
      },
    });
  
    return this.mapToUserResponseDto(newUser);
  }
  
  async getUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return this.mapToUserResponseDto(user);
  }

  async getUserByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.prismaService.user.findFirst({ where: { email } });
    return user ? this.mapToUserResponseDto(user) : null;
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
      message: 'User(s) soft-deleted',
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
      message: 'User(s) permanently deleted',
    };
  }
}
