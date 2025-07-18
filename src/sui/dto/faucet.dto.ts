import { IsString, IsNotEmpty, registerDecorator, ValidationArguments } from 'class-validator';

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
                }
            },
        });
    };
}

export class FaucetDto {
    @IsString()
    @IsNotEmpty()
    @IsSuiAddress()
    address: string;
}