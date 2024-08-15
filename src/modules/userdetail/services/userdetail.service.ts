import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/services/prisma.service';
import { IUserDetailService } from '../interfaces/userdetail.service.interface';
import { UserDetailCreateDto } from '../dtos/userdetail.create.dto';
import { UserDetailUpdateDto } from '../dtos/userdetail.update.dto';
import { UserDetailResponseDto } from '../dtos/userdetail.response.dto';
import { UserDetail } from '@prisma/client';

@Injectable()
export class UserDetailService implements IUserDetailService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateProfile(userId: string, data: UserDetailUpdateDto): Promise<UserDetailResponseDto> {
    const updatedUserDetail = await this.prismaService.userDetail.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return this.mapToResponseDto(updatedUserDetail);
  }

  async createProfile(data: UserDetailCreateDto): Promise<UserDetailResponseDto> {
    // console.log('Received data:', data);
    const createdUserDetail = await this.prismaService.userDetail.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return new UserDetailResponseDto(createdUserDetail);
  }

  async getProfileById(userId: string): Promise<UserDetailResponseDto> {
    const userDetail = await this.prismaService.userDetail.findUnique({
      where: { id: userId },
    });

    return this.mapToResponseDto(userDetail);
  }

  private mapToResponseDto(userDetail: UserDetail | null): UserDetailResponseDto {
    if (!userDetail) {
      return null;
    }

    const { id, display_name, gender, birthday, horoscope, zodiac, height, weight, isActive, createdAt, updatedAt } = userDetail;

    return new UserDetailResponseDto({
      id,
      displayName: display_name,
      gender,
      birthday,
      horoscope,
      zodiac,
      height,
      weight,
      isActive,
      createdAt,
      updatedAt,
    });
  }
}