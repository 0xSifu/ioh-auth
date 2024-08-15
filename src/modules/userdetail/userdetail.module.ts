import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserDetailController } from '../userdetail/controllers/userdetail.controller';
import { UserDetailService } from './services/userdetail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UserDetailController],
  providers: [UserDetailService, PrismaService],
  exports: [UserDetailService],
})
export class UserDetailModule {}