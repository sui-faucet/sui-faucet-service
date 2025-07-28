import { Injectable, Logger } from '@nestjs/common';
import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as geoip from 'geoip-lite';
import { SuiTransactionBlockResponse } from '@mysten/sui/client';

import { RedisService } from '../redis/redis.service';
import { SystemSettingService } from '../system_setting/system_setting.service';
import {
  Transaction as TransactionModel,
  TransactionStatus,
} from './schema/transaction.schema';

@Injectable()
export class SuiService {
  private readonly logger = new Logger(SuiService.name);
  private client: SuiClient;
  private keypair: Ed25519Keypair;

  constructor(
    private readonly redisService: RedisService,
    private readonly systemSettingService: SystemSettingService,
    @InjectModel(TransactionModel.name)
    private transactionModel: Model<TransactionModel>,
  ) {
    this.client = new SuiClient({
      url: 'https://fullnode.testnet.sui.io',
    });
    this.keypair = Ed25519Keypair.fromSecretKey(process.env.SECRET_KEY ?? '');
  }

  getAddress() {
    const address = this.keypair.getPublicKey().toSuiAddress();
    return address;
  }

  async getSuiBalance() {
    const suiBalance = await this.client.getBalance({
      owner: this.getAddress(),
      coinType: '0x2::sui::SUI',
    });
    return Number(suiBalance.totalBalance) / Number(MIST_PER_SUI);
  }

  async transferSui(recipient: string, amount: number) {
    const suiBalance = await this.getSuiBalance();

    if (suiBalance < amount) {
      throw new Error('Insufficient balance');
    }

    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [BigInt(amount) * MIST_PER_SUI]);
    tx.transferObjects([coin], recipient);
    const transactionResult = await this.executeTransaction(tx);
    return transactionResult;
  }

  async executeTransaction(tx: Transaction) {
    const transactionResult = await this.client.signAndExecuteTransaction({
      transaction: tx,
      signer: this.keypair,
      options: {
        showEffects: true,
        showObjectChanges: true,
        showEvents: true,
      },
    });

    if (transactionResult.effects?.status.status !== 'success') {
      throw new Error('Transaction failed');
    }

    return transactionResult;
  }

  async saveTransaction(
    txResponse: SuiTransactionBlockResponse,
    ipAddress: string,
    walletAddress: string,
    userAgent: string,
    responseTime: number,
  ) {
    const geo = geoip.lookup(ipAddress);

    const transactionData = {
      ipAddress: ipAddress,
      country: geo?.country || 'Unknown',
      txHash: txResponse.digest,
      status: TransactionStatus.SUCCESS,
      amount: 1,
      walletAddress,
      userAgent: userAgent,
      responseTime: responseTime,
    };

    const transaction = new this.transactionModel(transactionData);
    const savedTransaction = await transaction.save();
    return savedTransaction;
  }

  async saveFailedTransaction(
    error: Error,
    ipAddress: string,
    walletAddress: string,
    userAgent: string,
    amount: number,
    responseTime: number,
  ) {
    const geo = geoip.lookup(ipAddress);

    const transactionData = {
      ipAddress: ipAddress,
      country: geo?.country || 'Unknown',
      txHash: null,
      status: TransactionStatus.FAILED,
      amount: amount,
      walletAddress,
      userAgent: userAgent,
      errorMessage: error.message,
      responseTime: responseTime,
    };

    const transaction = new this.transactionModel(transactionData);
    const savedTransaction = await transaction.save();
    return savedTransaction;
  }
}
