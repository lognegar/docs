import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { context, trace } from '@opentelemetry/api';

const tracer = trace.getTracer('auth-service');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string, name: string) {
    return tracer.startActiveSpan(
      'register-service',
      undefined,
      context.active(),
      async (span) => {
        try {
          const hashSpan = tracer.startSpan(
            'hash-password',
            undefined,
            context.active(),
          );

          const hashedPassword = await argon2.hash(password);

          hashSpan.end();

          const user = this.userRepository.create({
            name,
            username,
            password: hashedPassword,
          });

          await this.userRepository.save(user);

          span.setAttribute('auth.success', true);
          span.setAttribute('auth.userId', user.id);
          span.end();

          return { message: 'User registered successfully' };
        } catch (error) {
          span.recordException(error);
          span.setAttribute('auth.success', false);
          span.end();
          throw error;
        }
      },
    );
  }

  async login(username: string, password: string) {
    return tracer.startActiveSpan(
      'login-service',
      undefined,
      context.active(),
      async (span) => {
        try {
          span.setAttribute('auth.username', username);

          const user = await this.userRepository.findOneBy({ username });

          const comparePasswordSpan = tracer.startSpan(
            'compare-password',
            undefined,
            context.active(),
          );

          if (!user || !(await argon2.verify(user.password, password))) {
            span.setAttribute('auth.success', false);
            span.addEvent('Invalid credentials');
            throw new BadRequestException('Invalid credentials');
          }

          comparePasswordSpan.end();

          const jwtSignSpan = tracer.startSpan('jwt-sign');

          const token = this.jwtService.sign({
            userId: user.id,
            username: user.username,
          });

          jwtSignSpan.end();

          span.setAttribute('auth.success', true);
          span.setAttribute('auth.userId', user.id);
          span.end();

          return { access_token: token };
        } catch (error) {
          span.recordException(error);
          span.setAttribute('auth.success', false);
          span.end();
          throw error;
        }
      },
    );
  }
}
