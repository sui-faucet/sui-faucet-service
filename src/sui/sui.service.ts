import { Injectable } from '@nestjs/common';
import { SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { MIST_PER_SUI } from '@mysten/sui/utils';

import { RedisService } from '../redis/redis.service';

@Injectable()
export class SuiService {
  private client: SuiClient;
  private keypair: Ed25519Keypair;

  constructor(private readonly redisService: RedisService) {
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
    return suiBalance;
  }

  async transferSui(recipient: string, amount: bigint) {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [amount * MIST_PER_SUI]);
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
    return transactionResult;
  }
}
