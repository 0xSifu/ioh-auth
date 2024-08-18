import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { faker } from '@faker-js/faker';
import { Language, ActiveStatus } from '@prisma/client';

export class UserCreateDto {
  @ApiProperty({
    example: faker.internet.email(),
  })
  @IsString()
  @IsNotEmpty({ message: 'email not provided' })
  public email: string;

  @ApiProperty({
    example: faker.internet.userName(),
  })
  @IsString()
  @IsNotEmpty({ message: 'username not provided' })
  public username: string;

  @ApiProperty({
    example: faker.internet.password(),
  })
  @IsString()
  @IsNotEmpty({ message: 'password not provided' })
  public password: string;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  public is_account_admin?: boolean;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  public is_admin?: boolean;

  @ApiProperty({
    example: 'en',
    enum: Language,
  })
  @IsEnum(Language)
  @IsOptional()
  public userLanguage?: Language;

  @ApiProperty({
    example: 'ACTIVE',
    enum: ActiveStatus,
  })
  @IsEnum(ActiveStatus)
  @IsOptional()
  public userStatus?: ActiveStatus;

}
