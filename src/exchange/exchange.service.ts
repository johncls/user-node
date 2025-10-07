// src/exchange/exchange.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExchangeService {
  constructor(private readonly httpService: HttpService) { }

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

  async getPriceCrypto(symbol: 'BTC' | 'ETH' | 'USDT'): Promise<number> {
    const symbolMap = {
      BTC: 'tBTCUSD',
      ETH: 'tETHUSD',
    };

    const url = `https://api-pub.bitfinex.com/v2/ticker/${symbolMap[symbol]}`;
    const response = await firstValueFrom(this.httpService.get(url));
    const priceInUsd = response.data[6]; // Precio de 1 BTC o ETH en USD

    if (!priceInUsd || priceInUsd <= 0) {
      throw new Error(`Precio inválido para ${symbol}`);
    }

    // Devuelve cuántos BTC/ETH te da 1 USDT
    const cryptoPerUsdt = 1 / priceInUsd;

    console.log(`1 USDT = ${cryptoPerUsdt} ${symbol}`);
    return cryptoPerUsdt;
  }

}
