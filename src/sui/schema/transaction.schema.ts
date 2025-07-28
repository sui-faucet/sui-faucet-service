import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Transaction {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  walletAddress: string;

  @Prop()
  normalizedAmount: number;

  @Prop()
  txHash: string;

  @Prop({ required: true, enum: TransactionStatus })
  status: TransactionStatus;

  @Prop({ required: false })
  errorMessage?: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true })
  responseTime: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
