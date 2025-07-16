import { Controller, Get, Version } from '@nestjs/common';
import { SuiService } from './sui.service';

@Controller('sui')
export class SuiController {
    constructor(private readonly suiService: SuiService) { }

    @Get()
    @Version('1')
    faucet() {
        return { message: 'Hello World' };
    }
}
