// src/transaction/entities/transaction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  type: 'deposit' | 'withdrawal';

  @Column()
  originalAmount: number;

  @Column()
  originalCurrency: string; // BTC, ETH, USDT

  @Column()
  usdtAmount: number;

  @CreateDateColumn()
  timestamp: Date;
}