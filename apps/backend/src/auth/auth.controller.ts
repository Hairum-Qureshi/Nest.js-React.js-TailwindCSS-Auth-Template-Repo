import {
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import express from 'express';
import type { Response, CookieOptions } from 'express';
import { BearerToken } from 'src/decorators/bearerToken.decorator';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import * as types from 'src/types';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/sign-in')
  @UsePipes(new ValidationPipe())
  async googleAuth(
    @BearerToken() token: string,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<{ jwtToken: string }> {
    const { jwtToken } = await this.authService.googleAuth(token);

    res.cookie('auth-session', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { jwtToken };
  }

  @Post('sign-out')
  signOut(@Res({ passthrough: true }) res: Response): {
    message: string;
  } {
    res.clearCookie(
      'auth-session',
      this.authService.getAuthCookieOptions() as CookieOptions,
    );
    return { message: 'success' };
  }

  @Get('current-user')
  @UseGuards(AuthGuard())
  getCurrentUser(@CurrentUser() user: types.UserPayload): types.UserPayload {
    return this.authService.getCurrentUser(user);
  }
}