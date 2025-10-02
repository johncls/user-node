// src/transaction/transaction.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DepositDto } from './dto/deposit.dto';
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
        currency: depositDto.currency,
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
}
