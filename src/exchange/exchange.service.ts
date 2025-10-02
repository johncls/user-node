// src/exchange/exchange.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExchangeService {
  constructor(private readonly httpService: HttpService) {}

  async getUSDTPrice(symbol: 'BTC' | 'ETH'): Promise<number> {
    const symbolMap = {
      BTC: 'tBTCUSD',
      ETH: 'tETHUSD',
    };

    const url = `https://api-pub.bitfinex.com/v2/ticker/${symbolMap[symbol]}`;
    const response = await firstValueFrom(this.httpService.get(url));
    const price = response.data[6]; // Index 6 is last price
    console.log('price', price);
    return price;
  }
}
