import { IsIn, IsNumber, IsPositive, IsString } from "class-validator";

// src/transaction/dto/deposit.dto.ts
export class DepositDto {
    @IsNumber()
    @IsPositive()
    amount: number;
  
    @IsString()
    @IsIn(['BTC', 'ETH', 'USDT'])
    currency: string;
  }

export class WithdrawalDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsIn(['BTC', 'ETH', 'USDT'])
  currency: string;
}
