import { IsString, IsDate, IsBoolean, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

export class UserDetailUpdateDto {
  @ApiProperty({ example: faker.name.fullName(), required: false })
  @IsString()
  @IsOptional()
  display_name?: string;

  @ApiProperty({ example: faker.name.gender(), required: false })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: faker.date.past(20), required: false })
  @IsDate()
  @IsOptional()
  birthday?: Date;

  @ApiProperty({ example: faker.random.word(), required: false })
  @IsString()
  @IsOptional()
  horoscope?: string;

  @ApiProperty({ example: faker.random.word(), required: false })
  @IsString()
  @IsOptional()
  zodiac?: string;

  @ApiProperty({ example: faker.datatype.number({ min: 140, max: 200 }), required: false })
  @IsInt()
  @IsOptional()
  height?: number;

  @ApiProperty({ example: faker.datatype.number({ min: 40, max: 100 }), required: false })
  @IsInt()
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}