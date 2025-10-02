import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [UserModule, AuthModule, TransactionModule, ExchangeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
