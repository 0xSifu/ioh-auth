import { Prisma, User, Language, ActiveStatus } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
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
  isAccountAdmin: boolean;
  isAdmin: boolean;
  userStatus: ActiveStatus;
  userLanguage: Language;
}
