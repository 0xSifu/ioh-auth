import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: faker.internet.email(),
  })
  @IsString()
  @IsOptional()
  public email?: string;

  @ApiProperty({
    example: faker.internet.userName(),
  })
  @IsString()
  @IsOptional()
  public username?: string;

}
