import { TransactionStatus } from '../../sui/schema/transaction.schema';

export interface TransactionStats {
  status: TransactionStatus;
  count: number;
  totalAmount: number;
}

export interface TopSource {
  ipAddress: string;
  count: number;
  successCount: number;
  failureCount: number;
}

export interface FailureReason {
  _id: string;
  count: number;
  errorMessages: string[];
}

export interface GeographicDistribution {
  _id: string;
  count: number;
  successCount: number;
  failureCount: number;
}

export interface HourlyDistribution {
  _id: number;
  count: number;
  successCount: number;
  failureCount: number;
}

export interface SystemPerformance {
  avgResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  totalRequests: number;
}

export interface TopCountry {
  country: string;
  count: number;
  successCount: number;
  failureCount: number;
  percentage: number;
}

export interface TopCountries {
  countries: TopCountry[];
  totalTransactions: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}
