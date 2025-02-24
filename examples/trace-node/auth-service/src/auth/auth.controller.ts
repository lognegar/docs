import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { context, propagation } from '@opentelemetry/api';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDTO, @Req() req: Request) {
    const extractedContext = propagation.extract(context.active(), req.headers);
    return context.with(extractedContext, () => {
      return this.authService.register(body.username, body.password, body.name);
    });
  }

  @Post('login')
  login(@Body() body: LoginDTO, @Req() req: Request) {
    const extractedContext = propagation.extract(context.active(), req.headers);
    return context.with(extractedContext, () => {
      return this.authService.login(body.username, body.password);
    });
  }
}
