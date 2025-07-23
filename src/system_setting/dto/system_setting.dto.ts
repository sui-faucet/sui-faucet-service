import { IsNotEmpty, IsInt, IsBoolean } from 'class-validator';

export class CreateSystemSettingDto {
    @IsInt()
    @IsNotEmpty()
    suiFaucetAmount: number;

    @IsInt()
    @IsNotEmpty()
    limitPerIp: number;

    @IsInt()
    @IsNotEmpty()
    limitPerWalletAddress: number;

    @IsInt()
    @IsNotEmpty()
    ttlPerIp: number;

    @IsInt()
    @IsNotEmpty()
    ttlPerWalletAddress: number;

    @IsBoolean()
    @IsNotEmpty()
    isFaucetEnabled: boolean;

    @IsBoolean()
    @IsNotEmpty()
    isRateLimitEnabled: boolean;
}

export class UpdateSystemSettingDto {
    @IsInt()
    suiFaucetAmount: number;

    @IsInt()
    limitPerIp: number;

    @IsInt()
    limitPerWalletAddress: number;

    @IsInt()
    ttlPerIp: number;

    @IsInt()
    ttlPerWalletAddress: number;

    @IsBoolean()
    isFaucetEnabled: boolean;

    @IsBoolean()
    isRateLimitEnabled: boolean;
}