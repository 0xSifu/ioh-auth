import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { JwtService } from '@nestjs/jwt';
  import {
    IAuthPayload,
    ITokenResponse,
    TokenType,
  } from '../interfaces/auth.interface';
  import { UserService } from '../../user/services/user.service';
  import { UserLoginDto } from '../dtos/auth.login.dto';
  import { UserCreateDto } from '../dtos/auth.signup.dto';
  import { HelperHashService } from './helper.hash.service';
  import { IAuthService } from '../interfaces/auth.service.interface';
  import { AuthResponseDto } from '../dtos/auth.response.dto';
  import { PrismaService } from '../../../common/services/prisma.service';
  import { ClientProxy } from '@nestjs/microservices';
  
  @Injectable()
  export class AuthService implements IAuthService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;
    private readonly accessTokenExp: string;
    private readonly refreshTokenExp: string;
  
    constructor(
      @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService,
      private readonly userService: UserService,
      private readonly helperHashService: HelperHashService,
      private readonly prismaService: PrismaService,
    ) {
      this.accessTokenSecret = this.configService.get<string>(
        'auth.accessToken.secret',
      );
      this.refreshTokenSecret = this.configService.get<string>(
        'auth.refreshToken.secret',
      );
      this.accessTokenExp = this.configService.get<string>(
        'auth.accessToken.expirationTime',
      );
      this.refreshTokenExp = this.configService.get<string>(
        'auth.refreshToken.expirationTime',
      );
    }
  
    async verifyToken(accessToken: string): Promise<IAuthPayload> {
      try {
        const data = await this.jwtService.verifyAsync(accessToken, {
          secret: this.accessTokenSecret,
        });
        return data;
      } catch (e) {
        throw e;
      }
    }
  
    async generateTokens(user: IAuthPayload): Promise<ITokenResponse> {
      try {
        const accessToken = await this.jwtService.signAsync(
          {
            id: user.id,
            tokenType: TokenType.ACCESS_TOKEN,
          },
          {
            secret: this.configService.get<string>('auth.accessToken.secret'),
            expiresIn: this.configService.get<string>(
              'auth.accessToken.expirationTime',
            ),
          },
        );
  
        const refreshToken = await this.jwtService.signAsync(
          {
            id: user.id,
            tokenType: TokenType.REFRESH_TOKEN,
          },
          {
            secret: this.configService.get<string>('auth.refreshToken.secret'),
            expiresIn: this.configService.get<string>(
              'auth.refreshToken.expirationTime',
            ),
          },
        );
  
        await this.authClient.emit(
          process.env.RABBITMQ_AUTH_QUEUE,
          JSON.stringify({ accessToken, refreshToken, user }),
        );
  
        return {
          accessToken,
          refreshToken,
        };
      } catch (e) {
        console.error('Error generating tokens:', e);
        throw e;
      }
    }
  
    async login(data: UserLoginDto): Promise<AuthResponseDto> {
      try {
        const { email, password } = data;
        const now = new Date();
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
          throw new NotFoundException('userNotFound');
        }
        const match = this.helperHashService.match(user.password, password);
        if (!match) {
          throw new NotFoundException('invalidPassword');
        }

        const info = await this.userService.updateLoginInfo(user.id);
        user.lastLogin = info.lastLogin

        const { accessToken, refreshToken } = await this.generateTokens({
          id: user.id,
        });
  
        return {
          accessToken,
          refreshToken,
          user,
        };
      } catch (e) {
        throw e;
      }
    }
  
    async signup(data: UserCreateDto): Promise<AuthResponseDto> {
      try {
        const { email, username, password, is_account_admin, is_admin, userLanguage, userStatus } = data;
        const findUser = await this.userService.getUserByEmail(email);
        if (findUser) {
          throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }
        const passwordHashed = await this.helperHashService.createHash(password);
        const createdUser = await this.userService.createUser({
          email,
          username,
          password: passwordHashed,
          is_account_admin,
          is_admin,
          userLanguage,
          userStatus
        });
        const tokens = await this.generateTokens({ id: createdUser.id });
        delete createdUser.password;
        return {
          ...tokens,
          user: createdUser,
        };
      } catch (e) {
        throw e;
      }
    }
    
    async logout(userId: string): Promise<boolean> {
      try {
        await this.authClient.emit('user.logout', { userId });
        return true;
      } catch (error) {
        console.error(`Logout failed for userId ${userId}:`, error);
        return false;
      }
    }
    
  }
  