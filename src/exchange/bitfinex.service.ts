import { Injectable } from "@nestjs/common";

@Injectable()
export class BitfinexService {
  async getTicker(symbol: string): Promise<number> {
    const response = await fetch(`https://api.bitfinex.com/v1/pubticker/${symbol}`);
    const data = await response.json();
    return parseFloat(data.last_price);
  }
}