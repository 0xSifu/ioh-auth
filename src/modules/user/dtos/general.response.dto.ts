import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class GeneralResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Exclude()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isActive: boolean;

  constructor(partial: Partial<GeneralResponseDto>) {
    Object.assign(this, partial);
  }
}
