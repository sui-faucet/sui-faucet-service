import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Transaction,
  TransactionStatus,
} from '../sui/schema/transaction.schema';
import {
  TransactionStats,
  TopSource,
  GeographicDistribution,
  SystemPerformance,
  TopCountry,
  TopCountries,
} from './types/analytics.types';

@Injectable()
export class AnalyticsService {
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

    return stats;
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

    return topSources;
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

    return {
      countries: topCountries as TopCountry[],
      totalTransactions,
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    };
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
      {
        $project: {
          _id: 0,
          avgResponseTime: 1,
          maxResponseTime: 1,
          minResponseTime: 1,
          totalRequests: 1,
        },
      },
    ]);

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

    return activity;
  }
}
