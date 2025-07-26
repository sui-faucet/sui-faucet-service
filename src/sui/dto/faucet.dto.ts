import {
  IsString,
  IsNotEmpty,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Custom validator to check if the address is a valid Sui address
function IsSuiAddress() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSuiAddress',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /^0x[a-fA-F0-9]{64}$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Sui address (0x + 64 hex chars)`;
        },
      },
    });
  };
}

export class FaucetDto {
  @ApiProperty({
    description: 'The wallet address to receive the faucet',
    example:
      '0xd10d3a3472d074baa16e5e6dba32e4d373e4eb4b6224d66c7bcb4a34c5ec8e64',
  })
  @IsString()
  @IsNotEmpty()
  @IsSuiAddress()
  walletAddress: string;
}
