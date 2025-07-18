import { Controller, Get, Version, Post, Body } from '@nestjs/common';

import { SuiService } from './sui.service';
import { FaucetDto } from './dto/faucet.dto';

@Controller('sui')
export class SuiController {
    constructor(private readonly suiService: SuiService) { }

    @Post('faucet')
    @Version('1')
    faucet(@Body() body: FaucetDto) {
        const result = this.suiService.transferSui(body.address, BigInt(1));
        return result;
    }
    
    @Get('address')
    @Version('1')
    getAddress() {
        const address = this.suiService.getAddress();
        return address;
    }

    @Get('balance')
    @Version('1')
    getBalance() {
        const balance = this.suiService.getSuiBalance();
        return balance;
    }
}
