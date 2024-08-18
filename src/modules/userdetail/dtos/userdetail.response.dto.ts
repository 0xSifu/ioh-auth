import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';

export class UserDetailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Exclude()
  userId: string;

  @ApiProperty({ name: 'display_name' })
  displayName: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  @Transform(({ value }) => value ? value.toISOString() : null)
  birthday: Date | null;

  @ApiProperty()
  horoscope: string;

  @ApiProperty()
  zodiac: string;

  @ApiProperty()
  height: number;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date | null;

  @ApiProperty()
  updatedAt: Date | null;

  constructor(partial: Partial<UserDetailResponseDto>) {
    Object.assign(this, partial);
  }
}