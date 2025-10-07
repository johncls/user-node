// src/transaction/transaction.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DepositDto, WithdrawalDto } from './dto/deposit.dto';
import { ExchangeService } from '../exchange/exchange.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TransactionService extends PrismaClient {
  constructor(private readonly exchangeService: ExchangeService) {
    super();
  }

  async deposit(userId: string, depositDto: DepositDto) {
    const user = await this.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // 1. Obtener precio de USDT
    const usdtPrice = await this.exchangeService.getUSDTPrice(depositDto.currency as 'BTC' | 'ETH');

    // 2. Calcular monto en USDT
    const usdtAmount = depositDto.amount * usdtPrice;


    // 3. Registrar transacción (ledger)
    const transaction = await this.transaction.create({
      data: {
        userId,
        type: 'deposit',
        originalAmount: depositDto.amount,
        originalCurrency: depositDto.currency,
        usdtAmount,
        currency: usdtAmount > 0 ? 'USDT' : depositDto.currency,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 4. Actualizar balance del usuario
    await this.user.update({
      where: { id: userId },
      data: {
        balance: user.balance + usdtAmount,
      },
    });

    return {
      message: 'Deposit successful',
      transaction,
    };
  }

  async withdrawal(userId: string, withdrawalDto: WithdrawalDto) {
    const user = await this.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    let usdtPrice: number;
    let usdtAmount: number;
    let balanceUSDTUser: number;

    if (withdrawalDto.currency === 'USDT') {
      if(user.balance < withdrawalDto.amount) throw new BadRequestException('Insufficient cash');    
       usdtAmount =  user.balance - withdrawalDto.amount;
       balanceUSDTUser = usdtAmount;
       
    } else {
      if(user.balance < withdrawalDto.amount) throw new BadRequestException('Insufficient cash');
       usdtPrice = await this.exchangeService.getPriceCrypto(withdrawalDto.currency as 'BTC' | 'ETH' | 'USDT');
       usdtAmount =  usdtPrice * withdrawalDto.amount;
       balanceUSDTUser = user.balance - withdrawalDto.amount;
    }


    // 3. Registrar transacción (ledger)
    const transaction = await this.transaction.create({
      data: {
        userId,
        type: 'withdrawal',
        originalAmount: withdrawalDto.amount,
        originalCurrency: withdrawalDto.currency,
        usdtAmount,
        currency:  withdrawalDto.currency,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 4. Actualizar balance del usuario
    await this.user.update({
      where: { id: userId },
      data: {
        balance: balanceUSDTUser,
      },
    });

    return {
      message: 'Withdrawal successful',
      transaction,
    };
  }

  async allUserTransactions(userId: string) {
    const transactions = await this.transaction.findMany({ where: { userId: userId } });
    return transactions;
  }

}
