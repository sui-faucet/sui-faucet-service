import { Injectable } from "@nestjs/common";
import { HealthIndicatorResult } from "@nestjs/terminus";
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, STATES } from 'mongoose';

@Injectable()
export class MongoHealthIndicator {
    constructor(@InjectConnection() private connection: Connection) { }

    async pingCheck(): Promise<HealthIndicatorResult> {
        try {
            // Check if connection is ready
            if (!this.connection || this.connection.readyState !== STATES.connected) {
                return {
                    mongo: {
                        status: 'down',
                        message: `MongoDB connection not ready. State: ${this.connection?.readyState || 'undefined'}`,
                    },
                };
            }

            // Ping MongoDB to check if it's responsive
            if (!this.connection.db) {
                return {
                    mongo: {
                        status: 'down',
                        message: 'MongoDB database not available',
                    },
                };
            }
            const result = await this.connection.db.admin().ping();

            if (result && typeof result === 'object' && 'ok' in result && result.ok === 1) {
                return {
                    mongo: {
                        status: 'up',
                        message: 'MongoDB is responding',
                    },
                };
            } else {
                return {
                    mongo: {
                        status: 'down',
                        message: 'MongoDB ping failed',
                    },
                };
            }
        } catch (error) {
            return {
                mongo: {
                    status: 'down',
                    message: `MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            };
        }
    }
}