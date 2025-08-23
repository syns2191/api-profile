import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    config: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.refresh_token]),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true
    })
  }

  async validate(req: any, payload: { sub: string, email: string }) {
    return {
      ...payload,
      refreshToken: req.cookies?.refresh_token
    }
  }
}
