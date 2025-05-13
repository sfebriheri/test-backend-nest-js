import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

type MenuCategory = PrismaClient['menuCategory']['payload']['select'];
type MenuItem = PrismaClient['menuItem']['payload']['select'];

export interface CachedMenu {
  categories: (MenuCategory & {
    menuItems: MenuItem[];
  })[];
  lastUpdated: Date;
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly DEFAULT_TTL = 3600; // 1 hour
  private readonly MENU_KEY_PREFIX = 'menu:';
  private readonly ANALYTICS_KEY_PREFIX = 'analytics:';
  private readonly client;

  constructor(
    @Inject('REDIS_CLIENT') redisClient: RedisClientType,
    private configService: ConfigService
  ) {
    this.client = createClient({
      url: this.configService.get('REDIS_URL'),
    });
    this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  private getMenuKey(restaurantId: string): string {
    return `${this.MENU_KEY_PREFIX}${restaurantId}`;
  }

  private getAnalyticsKey(restaurantId: string, date: string): string {
    return `${this.ANALYTICS_KEY_PREFIX}${restaurantId}:${date}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.client.set(key, serialized, { EX: ttl });
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async getMenu(restaurantId: string): Promise<CachedMenu | null> {
    return this.get<CachedMenu>(this.getMenuKey(restaurantId));
  }

  async setMenu(restaurantId: string, menu: CachedMenu, ttl = this.DEFAULT_TTL): Promise<void> {
    await this.set(this.getMenuKey(restaurantId), menu, ttl);
  }

  async invalidateMenu(restaurantId: string): Promise<void> {
    await this.del(this.getMenuKey(restaurantId));
  }

  async getAnalytics(restaurantId: string, date: string): Promise<any | null> {
    return this.get(this.getAnalyticsKey(restaurantId, date));
  }

  async setAnalytics(restaurantId: string, date: string, data: any, ttl = this.DEFAULT_TTL): Promise<void> {
    await this.set(this.getAnalyticsKey(restaurantId, date), data, ttl);
  }

  async invalidateAnalytics(restaurantId: string, date: string): Promise<void> {
    await this.del(this.getAnalyticsKey(restaurantId, date));
  }

  async invalidateAllAnalytics(restaurantId: string): Promise<void> {
    const keys = await this.client.keys(`${this.ANALYTICS_KEY_PREFIX}${restaurantId}:*`);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  async getPopularItems(restaurantId: string, limit = 10): Promise<any[]> {
    const key = `${this.ANALYTICS_KEY_PREFIX}${restaurantId}:popular`;
    const data = await this.get<any[]>(key);
    return data || [];
  }

  async updatePopularItems(restaurantId: string, items: any[], ttl = this.DEFAULT_TTL): Promise<void> {
    const key = `${this.ANALYTICS_KEY_PREFIX}${restaurantId}:popular`;
    await this.set(key, items, ttl);
  }

  async flush(): Promise<void> {
    await this.client.flushAll();
  }
} 