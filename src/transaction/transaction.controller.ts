import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { DepositDto, WithdrawalDto } from "./dto/deposit.dto";
import { AuthGuard } from "../auth/jwt-auth.guard";
import { TransactionService } from "./transaction.service";

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AuthGuard)
  @Post('deposit')
  deposit(@Req() req, @Body() depositDto: DepositDto) {
    console.log('depositDto', depositDto);
    // Procesar depósito
    const userId = req.decodedData.sub;
    return this.transactionService.deposit(userId, depositDto);
  }

  @UseGuards(AuthGuard)
  @Post('withdrawal')
  Withdrawa(@Req() req, @Body() withdrawalDto: WithdrawalDto) {
    console.log('withdrawal', withdrawalDto);
    // Procesar depósito
    const userId = req.decodedData.sub;
    return this.transactionService.withdrawal(userId, withdrawalDto);
  }

  @UseGuards(AuthGuard)
  @Get('alltransactionsuser')
  AllUserTransactions(@Req() req) {
    // Procesar depósito
    const userId = req.decodedData.sub;
    return this.transactionService.allUserTransactions(userId);
  }
}