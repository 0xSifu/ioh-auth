import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { faker } from '@faker-js/faker';

export class UserCreateDto {
  @ApiProperty({
    example: faker.internet.email(),
  })
  @IsString()
  @IsNotEmpty({ message: 'email not provided' })
  public email: string;

  @ApiProperty({
    example: faker.internet.email(),
  })
  @IsString()
  @IsNotEmpty({ message: 'email not provided' })
  public username: string;

  @ApiProperty({
    example: faker.internet.userName(),
  })
  @IsString()
  @IsNotEmpty({ message: 'password not provided' })
  public password: string;

  // @IsString()
  // public identity_unique: string;
}
