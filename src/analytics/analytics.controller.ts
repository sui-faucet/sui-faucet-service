import {
  Controller,
  Get,
  Version,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Transaction } from '../sui/schema/transaction.schema';
import {
  TransactionStats,
  TopSource,
  GeographicDistribution,
  SystemPerformance,
  TopCountry,
  TopCountries,
} from './types/analytics.types';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('stats')
  @Version('1')
  @ApiOperation({ summary: 'Get transaction statistics' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to analyze',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getTransactionStats(
    @Query('days') days?: number,
  ): Promise<TransactionStats[]> {
    return await this.analyticsService.getTransactionStats(days);
  }

  @Get('top-sources')
  @Version('1')
  @ApiOperation({ summary: 'Get top request sources' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to analyze',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of results to return',
  })
  @ApiResponse({
    status: 200,
    description: 'Top sources retrieved successfully',
  })
  async getTopRequestSources(
    @Query('days') days?: number,
    @Query('limit') limit?: number,
  ): Promise<TopSource[]> {
    return await this.analyticsService.getTopRequestSources(days, limit);
  }

  @Get('history')
  @Version('1')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiQuery({
    name: 'walletAddress',
    required: false,
    type: String,
    description: 'Filter by wallet address',
  })
  @ApiQuery({
    name: 'ipAddress',
    required: false,
    type: String,
    description: 'Filter by IP address',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of results to return',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction history retrieved successfully',
  })
  async getTransactionHistory(
    @Query('walletAddress') walletAddress?: string,
    @Query('ipAddress') ipAddress?: string,
    @Query('limit') limit?: number,
  ): Promise<Transaction[]> {
    return await this.analyticsService.getTransactionHistory(
      walletAddress,
      ipAddress,
      limit,
    );
  }

  @Get('geographic')
  @Version('1')
  @ApiOperation({ summary: 'Get geographic distribution of requests' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to analyze',
  })
  @ApiResponse({
    status: 200,
    description: 'Geographic distribution retrieved successfully',
  })
  async getGeographicDistribution(
    @Query('days') days?: number,
  ): Promise<GeographicDistribution[]> {
    return await this.analyticsService.getGeographicDistribution(days);
  }

  @Get('top-country')
  @Version('1')
  @ApiOperation({ summary: 'Get the country that uses the faucet most' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to analyze',
  })
  @ApiResponse({
    status: 200,
    description: 'Top country retrieved successfully',
  })
  async getTopCountry(
    @Query('days') days?: number,
  ): Promise<TopCountry | null> {
    return await this.analyticsService.getTopCountry(days);
  }

  @Get('top-countries')
  @Version('1')
  @ApiOperation({ summary: 'Get top countries for chart visualization' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to analyze',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of top countries to return (default: 5)',
  })
  @ApiResponse({
    status: 200,
    description: 'Top countries retrieved successfully',
  })
  async getTopCountries(
    @Query('days') days?: number,
    @Query('limit') limit?: number,
  ): Promise<TopCountries> {
    return await this.analyticsService.getTopCountries(days, limit);
  }

  @Get('performance')
  @Version('1')
  @ApiOperation({ summary: 'Get system performance metrics' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to analyze',
  })
  @ApiResponse({
    status: 200,
    description: 'Performance metrics retrieved successfully',
  })
  async getSystemPerformance(
    @Query('days') days?: number,
  ): Promise<SystemPerformance | null> {
    return await this.analyticsService.getSystemPerformance(days);
  }

  @Get('wallet/:address')
  @Version('1')
  @ApiOperation({ summary: 'Get activity for specific wallet' })
  @ApiParam({
    name: 'address',
    description: 'Wallet address to analyze',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to analyze',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet activity retrieved successfully',
  })
  async getWalletActivity(
    @Param('address') address: string,
    @Query('days') days?: number,
  ): Promise<Transaction[]> {
    return await this.analyticsService.getWalletActivity(address, days);
  }
}
