import { IsNotEmpty, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSystemSettingDto {
  @ApiProperty({
    description: 'The amount of SUI to be sent to the faucet',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  suiFaucetAmount: number;

  @ApiProperty({
    description: 'The limit of requests per IP',
    example: 100,
  })
  @IsInt()
  @IsNotEmpty()
  limitPerIp: number;

  @ApiProperty({
    description: 'The limit of requests per wallet address',
    example: 100,
  })
  @IsInt()
  @IsNotEmpty()
  limitPerWalletAddress: number;

  @ApiProperty({
    description: 'The TTL of requests per IP',
    example: 100,
  })
  @IsInt()
  @IsNotEmpty()
  ttlPerIp: number;

  @ApiProperty({
    description: 'The TTL of requests per wallet address',
    example: 100,
  })
  @IsInt()
  @IsNotEmpty()
  ttlPerWalletAddress: number;

  @ApiProperty({
    description: 'Whether the faucet is enabled',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isFaucetEnabled: boolean;

  @ApiProperty({
    description: 'Whether the rate limit is enabled',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isRateLimitEnabled: boolean;
}

export class UpdateSystemSettingDto {
  @ApiProperty({
    description: 'The amount of SUI to be sent to the faucet',
    example: 1,
  })
  @IsInt()
  suiFaucetAmount: number;

  @ApiProperty({
    description: 'The limit of requests per IP',
    example: 100,
  })
  @IsInt()
  limitPerIp: number;

  @ApiProperty({
    description: 'The limit of requests per wallet address',
    example: 100,
  })
  @IsInt()
  limitPerWalletAddress: number;

  @ApiProperty({
    description: 'The TTL of requests per IP',
    example: 100,
  })
  @IsInt()
  ttlPerIp: number;

  @ApiProperty({
    description: 'The TTL of requests per wallet address',
    example: 100,
  })
  @IsInt()
  ttlPerWalletAddress: number;

  @ApiProperty({
    description: 'Whether the faucet is enabled',
    example: true,
  })
  @IsBoolean()
  isFaucetEnabled: boolean;

  @ApiProperty({
    description: 'Whether the rate limit is enabled',
    example: true,
  })
  @IsBoolean()
  isRateLimitEnabled: boolean;
}
