// lib/redis.js
import Redis from 'ioredis';

// Redis client singleton
let redisClient = null;

export function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    
    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });
    
    redisClient.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
    });
  }
  
  return redisClient;
}

// Cache wrapper
export class Cache {
  constructor(prefix = 'cache') {
    this.client = getRedisClient();
    this.prefix = prefix;
  }
  
  getKey(key) {
    return `${this.prefix}:${key}`;
  }
  
  async get(key) {
    try {
      const data = await this.client.get(this.getKey(key));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }
  
  async set(key, value, ttlSeconds = 3600) {
    try {
      await this.client.set(
        this.getKey(key),
        JSON.stringify(value),
        'EX',
        ttlSeconds
      );
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }
  
  async delete(key) {
    try {
      await this.client.del(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }
  
  async clear() {
    try {
      const keys = await this.client.keys(`${this.prefix}:*`);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Redis clear error:', error);
      return false;
    }
  }
}

// Rate limiter
export class RateLimiter {
  constructor(prefix = 'rate_limit') {
    this.client = getRedisClient();
    this.prefix = prefix;
  }
  
  getKey(identifier) {
    return `${this.prefix}:${identifier}`;
  }
  
  async checkLimit(identifier, limit = 10, windowSeconds = 60) {
    const key = this.getKey(identifier);
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - windowSeconds;
    
    try {
      // Remove old entries
      await this.client.zremrangebyscore(key, 0, windowStart);
      
      // Get current count
      const count = await this.client.zcard(key);
      
      if (count >= limit) {
        return { allowed: false, remaining: 0, resetAt: now + windowSeconds };
      }
      
      // Add new request
      await this.client.zadd(key, now, `${now}:${Math.random()}`);
      await this.client.expire(key, windowSeconds);
      
      return { allowed: true, remaining: limit - count - 1, resetAt: now + windowSeconds };
    } catch (error) {
      console.error('Rate limiter error:', error);
      return { allowed: true, remaining: limit };
    }
  }
  
  async increment(identifier) {
    const key = this.getKey(identifier);
    try {
      const count = await this.client.incr(key);
      await this.client.expire(key, 86400); // 24 hours
      return count;
    } catch (error) {
      console.error('Rate limiter increment error:', error);
      return 0;
    }
  }
  
  async getCount(identifier) {
    const key = this.getKey(identifier);
    try {
      return parseInt(await this.client.get(key)) || 0;
    } catch (error) {
      console.error('Rate limiter get count error:', error);
      return 0;
    }
  }
  
  async reset(identifier) {
    const key = this.getKey(identifier);
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Rate limiter reset error:', error);
      return false;
    }
  }
}

// Session manager
export class SessionManager {
  constructor() {
    this.client = getRedisClient();
    this.prefix = 'session';
  }
  
  getKey(sessionId) {
    return `${this.prefix}:${sessionId}`;
  }
  
  async create(sessionId, data, ttlSeconds = 86400) {
    try {
      await this.client.set(
        this.getKey(sessionId),
        JSON.stringify(data),
        'EX',
        ttlSeconds
      );
      return true;
    } catch (error) {
      console.error('Session create error:', error);
      return false;
    }
  }
  
  async get(sessionId) {
    try {
      const data = await this.client.get(this.getKey(sessionId));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Session get error:', error);
      return null;
    }
  }
  
  async update(sessionId, data) {
    try {
      const existing = await this.get(sessionId);
      if (!existing) return false;
      
      const updated = { ...existing, ...data };
      await this.client.set(this.getKey(sessionId), JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Session update error:', error);
      return false;
    }
  }
  
  async delete(sessionId) {
    try {
      await this.client.del(this.getKey(sessionId));
      return true;
    } catch (error) {
      console.error('Session delete error:', error);
      return false;
    }
  }
}

// Queue system for background jobs
export class Queue {
  constructor(name) {
    this.client = getRedisClient();
    this.name = name;
    this.queueKey = `queue:${name}`;
  }
  
  async add(job) {
    try {
      const jobData = {
        id: `${Date.now()}:${Math.random().toString(36).substring(7)}`,
        ...job,
        createdAt: new Date().toISOString(),
      };
      await this.client.lpush(this.queueKey, JSON.stringify(jobData));
      return jobData.id;
    } catch (error) {
      console.error('Queue add error:', error);
      return null;
    }
  }
  
  async process(handler) {
    try {
      while (true) {
        const job = await this.client.rpop(this.queueKey);
        if (job) {
          try {
            await handler(JSON.parse(job));
          } catch (error) {
            console.error('Queue processing error:', error);
          }
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Queue process error:', error);
    }
  }
  
  async getLength() {
    try {
      return await this.client.llen(this.queueKey);
    } catch (error) {
      console.error('Queue length error:', error);
      return 0;
    }
  }
  
  async clear() {
    try {
      await this.client.del(this.queueKey);
      return true;
    } catch (error) {
      console.error('Queue clear error:', error);
      return false;
    }
  }
}

// Export utility functions
export async function healthCheck() {
  try {
    const client = getRedisClient();
    await client.ping();
    return { status: 'healthy', redis: 'connected' };
  } catch (error) {
    return { status: 'unhealthy', redis: 'disconnected', error: error.message };
  }
}