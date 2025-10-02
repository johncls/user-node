import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ExchangeModule } from '../exchange/exchange.module';
import { UserModule } from '../user/user.module';
import {  PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    ExchangeModule, UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, JwtStrategy, AuthService, AuthGuard],
  exports: [TransactionService],
})
export class TransactionModule {}
