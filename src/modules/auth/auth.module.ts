import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../common/services/prisma.service';
import { AuthController } from './controllers/auth.controller';
import { HelperHashService } from './services/helper.hash.service';
import { UserService } from 'src/modules/user/services/user.service';
import { UserDetailService } from '../userdetail/services/userdetail.service';
import { PassportModule } from '@nestjs/passport';
import { AuthJwtAccessStrategy } from 'src/strategies/jwt.access.strategy';
import { AuthJwtRefreshStrategy } from 'src/strategies/jwt.refresh.strategy';
import { AuthEventController } from './controllers/auth-event.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('rmq.uri')}`],
            queue: `${configService.get('rmq.auth')}`,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    PassportModule.register({
      session: false,
    }),
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [AuthController, AuthEventController],
  providers: [
    AuthJwtAccessStrategy,
    AuthJwtRefreshStrategy,
    AuthService,
    HelperHashService,
    UserService,
    PrismaService,
    UserDetailService
  ],
  exports: [AuthService, HelperHashService],
})
export class AuthModule {}
