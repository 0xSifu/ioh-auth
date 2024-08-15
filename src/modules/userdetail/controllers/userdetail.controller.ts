import { Controller, Param, Body, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDetailCreateDto } from '../dtos/userdetail.create.dto';
import { UserDetailUpdateDto } from '../dtos/userdetail.update.dto';
import { UserDetailResponseDto } from '../dtos/userdetail.response.dto';
import { UserDetailService } from '../services/userdetail.service';
import { IUserDetailService } from '../interfaces/userdetail.service.interface';

@ApiTags('Profile')
@Controller({
  version: '1',
  path: 'profile',
})
export class UserDetailController {
  constructor(private readonly userDetailService: UserDetailService) {}

  @Post()
  async createProfile(@Body() data: UserDetailCreateDto): Promise<UserDetailResponseDto> {
    const createdUserDetail = await this.userDetailService.createProfile(data);
    return createdUserDetail;
  }

  @Put(':userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() data: UserDetailUpdateDto,
  ): Promise<UserDetailResponseDto> {
    const updatedUserDetail = await this.userDetailService.updateProfile(userId, data);
    return updatedUserDetail;
  }

  @Get(':userId')
  async getProfileById(@Param('userId') userId: string): Promise<UserDetailResponseDto> {
    const userDetail = await this.userDetailService.getProfileById(userId);
    return userDetail;
  }
}