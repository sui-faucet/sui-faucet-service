import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SystemSettingDocument = HydratedDocument<SystemSetting>;

@Schema({ collection: 'system_settings', timestamps: true })
export class SystemSetting {
    @Prop({ required: true, })
    suiFaucetAmount: number;

    @Prop({ required: true })
    limitPerIp: number;

    @Prop({ required: true })
    limitPerWalletAddress: number;

    @Prop({ required: true })
    ttlPerIp: number;

    @Prop({ required: true })
    ttlPerWalletAddress: number;

    @Prop({ required: true })
    isFaucetEnabled: boolean;

    @Prop({ required: true })
    isRateLimitEnabled: boolean;
}

export const SystemSettingSchema = SchemaFactory.createForClass(SystemSetting);
