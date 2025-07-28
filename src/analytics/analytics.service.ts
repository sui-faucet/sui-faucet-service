import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Transaction,
  TransactionStatus,
} from '../sui/schema/transaction.schema';
import {
  TransactionStats,
  TopSource,
  FailureReason,
  GeographicDistribution,
  HourlyDistribution,
  SystemPerformance,
  TopCountry,
  TopCountries,
} from './types/analytics.types';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async getTransactionStats(days: number = 7): Promise<TransactionStats[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await this.transactionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$normalizedAmount' },
        },
      },
    ]);

    this.logger.log(
      `Retrieved transaction stats for last ${days} days`,
      'Analytics',
    );
    return stats;
  }

  async getRateLimitViolations(days: number = 7): Promise<Transaction[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const violations = await this.transactionModel
      .find({
        createdAt: { $gte: startDate },
      })
      .select('walletAddress ipAddress createdAt')
      .sort({ createdAt: -1 });

    this.logger.log(
      `Retrieved ${violations.length} transactions for last ${days} days`,
      'Analytics',
    );
    return violations;
  }

  async getTopRequestSources(
    days: number = 7,
    limit: number = 10,
  ): Promise<TopSource[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const topSources = await this.transactionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$ipAddress',
          count: { $sum: 1 },
          successCount: {
            $sum: {
              $cond: [{ $eq: ['$status', TransactionStatus.SUCCESS] }, 1, 0],
            },
          },
          failureCount: {
            $sum: {
              $cond: [{ $eq: ['$status', TransactionStatus.FAILED] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          ipAddress: '$_id',
          count: 1,
          successCount: 1,
          failureCount: 1,
        },
      },
    ]);

    this.logger.log(
      `Retrieved top ${limit} request sources for last ${days} days`,
      'Analytics',
    );
    return topSources;
  }

  async getFailureReasons(days: number = 7): Promise<FailureReason[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const failureReasons = await this.transactionModel.aggregate([
      {
        $match: {
          status: TransactionStatus.FAILED,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$errorMessage',
          count: { $sum: 1 },
          errorMessages: { $addToSet: '$errorMessage' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    this.logger.log(
      `Retrieved failure reasons for last ${days} days`,
      'Analytics',
    );
    return failureReasons;
  }

  async getTransactionHistory(
    walletAddress?: string,
    ipAddress?: string,
    limit: number = 50,
  ): Promise<Transaction[]> {
    const filter: Record<string, any> = {};

    if (walletAddress) {
      filter.walletAddress = walletAddress;
    }

    if (ipAddress) {
      filter.ipAddress = ipAddress;
    }

    const history = await this.transactionModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');

    this.logger.log(
      `Retrieved transaction history with filter: ${JSON.stringify(filter)}`,
      'Analytics',
    );
    return history;
  }

  async getGeographicDistribution(
    days: number = 7,
  ): Promise<GeographicDistribution[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const geoDistribution = await this.transactionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          country: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
          successCount: {
            $sum: {
              $cond: [{ $eq: ['$status', TransactionStatus.SUCCESS] }, 1, 0],
            },
          },
          failureCount: {
            $sum: {
              $cond: [{ $eq: ['$status', TransactionStatus.FAILED] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    this.logger.log(
      `Retrieved geographic distribution for last ${days} days`,
      'Analytics',
    );
    return geoDistribution;
  }

  async getTopCountry(days: number = 7): Promise<TopCountry | null> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // First, get total transactions for percentage calculation
    const totalTransactions = await this.transactionModel.countDocuments({
      createdAt: { $gte: startDate },
      country: { $exists: true, $ne: null },
    });

    if (totalTransactions === 0) {
      this.logger.log('No transactions found with country data', 'Analytics');
      return null;
    }

    const topCountry = await this.transactionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          country: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
          successCount: {
            $sum: {
              $cond: [{ $eq: ['$status', TransactionStatus.SUCCESS] }, 1, 0],
            },
          },
          failureCount: {
            $sum: {
              $cond: [{ $eq: ['$status', TransactionStatus.FAILED] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
      {
        $addFields: {
          country: '$_id',
          percentage: {
            $multiply: [{ $divide: ['$count', totalTransactions] }, 100],
          },
        },
      },
      {
        $project: {
          _id: 0,
          country: 1,
          count: 1,
          successCount: 1,
          failureCount: 1,
          percentage: { $round: ['$percentage', 2] },
        },
      },
    ]);

    const result = topCountry[0] as TopCountry | undefined;

    this.logger.log(
      `Retrieved top country for last ${days} days: ${result?.country || 'None'} with ${result?.count || 0} transactions`,
      'Analytics',
    );

    return result || null;
  }

  async getTopCountries(
    days: number = 7,
    limit: number = 5,
  ): Promise<TopCountries> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

    // First, get total transactions for percentage calculation
    const totalTransactions = await this.transactionModel.countDocuments({
      createdAt: { $gte: startDate },
      country: { $exists: true, $ne: null },
    });

    if (totalTransactions === 0) {
      this.logger.log('No transactions found with country data', 'Analytics');
      return {
        countries: [],
        totalTransactions: 0,
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      };
    }

    const topCountries = await this.transactionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          country: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
          successCount: {
            $sum: {
              $cond: [{ $eq: ['$status', TransactionStatus.SUCCESS] }, 1, 0],
            },
          },
          failureCount: {
            $sum: {
              $cond: [{ $eq: ['$status', TransactionStatus.FAILED] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: limit,
      },
      {
        $addFields: {
          country: '$_id',
          percentage: {
            $multiply: [{ $divide: ['$count', totalTransactions] }, 100],
          },
        },
      },
      {
        $project: {
          _id: 0,
          country: 1,
          count: 1,
          successCount: 1,
          failureCount: 1,
          percentage: { $round: ['$percentage', 2] },
        },
      },
    ]);

    this.logger.log(
      `Retrieved top ${limit} countries for last ${days} days`,
      'Analytics',
    );

    return {
      countries: topCountries as TopCountry[],
      totalTransactions,
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    };
  }

  async getHourlyDistribution(days: number = 7): Promise<HourlyDistribution[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const hourlyDistribution = await this.transactionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 },
          successCount: {
            $sum: {
              $cond: [{ $eq: ['$status', TransactionStatus.SUCCESS] }, 1, 0],
            },
          },
          failureCount: {
            $sum: {
              $cond: [{ $eq: ['$status', TransactionStatus.FAILED] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    this.logger.log(
      `Retrieved hourly distribution for last ${days} days`,
      'Analytics',
    );
    return hourlyDistribution;
  }

  async getSystemPerformance(
    days: number = 7,
  ): Promise<SystemPerformance | null> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const performance = await this.transactionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          responseTime: { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' },
          maxResponseTime: { $max: '$responseTime' },
          minResponseTime: { $min: '$responseTime' },
          totalRequests: { $sum: 1 },
        },
      },
    ]);

    this.logger.log(
      `Retrieved system performance metrics for last ${days} days`,
      'Analytics',
    );
    return performance[0] || null;
  }

  async getWalletActivity(
    walletAddress: string,
    days: number = 30,
  ): Promise<Transaction[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activity = await this.transactionModel
      .find({
        walletAddress,
        createdAt: { $gte: startDate },
      })
      .sort({ createdAt: -1 });

    this.logger.log(
      `Retrieved activity for wallet ${walletAddress} for last ${days} days`,
      'Analytics',
    );
    return activity;
  }
}
