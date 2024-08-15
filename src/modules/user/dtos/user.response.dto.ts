import { Prisma, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements User {
    id: string;
    username: string;
    email: string;
    @Exclude()
    password: string;
    lastLogin: Date | null;
    isActive: boolean;
    isDelete: boolean;
    ipAddress: string | null;
    log: Prisma.JsonValue[];
  }
