import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Request } from 'express';
import { User, UserDocument } from './schemas/User';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.['auth-session'],
      ]),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: { _id: string; sub: string }) {
    const { _id } = payload;
    const user = await this.userModel.findById(_id).exec();
    if (!user) {
      throw new UnauthorizedException('Please log in first');
    }
    return user;
  }
}