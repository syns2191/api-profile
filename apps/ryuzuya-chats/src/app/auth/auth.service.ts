import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import { IUser } from '../users/interfaces/users.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private users: UserService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !password) {
      return null;
    }

    const ok = await this.users.validatePassword(user, password);
    if (ok) {
      const { password, ...userSafe} = user;
      return userSafe;
    }
  }

  private signTokens(user: IUser) {
    const payload = { sub: user.id, email: user.email, isOwner: user.isOwner };
    const accessToken = this.jwt.sign(payload, { secret: this.config.get<string>('JWT_ACCESS_SECRET') });
    const refreshToken = this.jwt.sign(payload, { secret: this.config.get<string>('JWT_REFRESH_SECRET') });
    return { accessToken, refreshToken };
  }

  setRefreshCookie(res: any, token: string) {
    res.setHeader('Set-Cookie', cookie.serialize('refresh_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 3600,
      path: '/'
    }));
  }

  clearRefreshCookie(res: any) {
    res.setHeader('Set-Cookie', cookie.serialize('refresh_token', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/'
    }));
  }

  async login(user: IUser, res: any) {
    // const userData = await this.users.findByEmail(user.email);
    // console.log('userdata', userData);
    const { accessToken, refreshToken } = this.signTokens(user);
    await this.users.setRefreshToken(user.id, refreshToken);
    this.setRefreshCookie(res, refreshToken);
    return {
      accessToken
    };
  }

  async refresh(userId: string, refreshToken: string, res: any) {
    const valid = await this.users.isRefreshTokenValid(userId, refreshToken);
    if (!valid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.users.findById(userId);
    const { accessToken, refreshToken: newRefreshToken } = this.signTokens(user);
    this.users.setRefreshToken(userId, newRefreshToken);
    this.setRefreshCookie(res, newRefreshToken);
    return {
      accessToken
    }
  }

  async logout(userId: string, res: any) {
    await this.users.setRefreshToken(userId, null);
    this.clearRefreshCookie(res);
  }

  async changePassword(userId: string, newPassword: string, oldPassword: string) {
    await this.users.updatePassword(userId, newPassword, oldPassword);
    return true;
  }
}
