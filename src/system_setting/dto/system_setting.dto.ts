import { IsNotEmpty, IsInt } from 'class-validator';

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
}