import { IsString, IsDate, IsBoolean, IsInt, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { Transform, Type } from 'class-transformer';

export class UserDetailCreateDto {
  
    @ApiProperty({ example: faker.database.mongodbObjectId() })
    @IsString()
    userId: string;
  
    @ApiProperty({ example: faker.name.fullName() })
    @IsString()
    @IsNotEmpty({ message: 'FullName not provided' })
    display_name: string;
  
    @ApiProperty({ example: faker.name.gender() })
    @IsString()
    @IsNotEmpty({ message: 'gender not provided' })
    gender: string;
  
    @ApiProperty({ example: new Date().toISOString() })
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty({ message: 'Birthday not provided' })
    @Transform(({ value }) => new Date(value))
    birthday: Date;
  
    @ApiProperty({ example: faker.random.word() })
    @IsString()
    horoscope: string;
  
    @ApiProperty({ example: faker.random.word() })
    @IsString()
    zodiac: string;
  
    @ApiProperty({ example: faker.datatype.number({ min: 140, max: 200 }) })
    @IsInt()
    @IsNotEmpty({ message: 'height not provided' })
    height: number;
  
    @ApiProperty({ example: faker.datatype.number({ min: 40, max: 100 }) })
    @IsInt()
    @IsNotEmpty({ message: 'weight not provided' })
    weight: number;
  
    @ApiProperty({ example: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}