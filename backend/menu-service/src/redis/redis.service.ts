import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, { EX: ttl });
    } else {
      await this.redis.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async getMenu(restaurantId: string): Promise<string | null> {
    return this.get(`menu:${restaurantId}`);
  }

  async setMenu(restaurantId: string, menu: string, ttl = 3600): Promise<void> {
    await this.set(`menu:${restaurantId}`, menu, ttl);
  }

  async invalidateMenu(restaurantId: string): Promise<void> {
    await this.del(`menu:${restaurantId}`);
  }
} 