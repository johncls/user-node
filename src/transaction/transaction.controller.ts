import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { DepositDto } from "./dto/deposit.dto";
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
}