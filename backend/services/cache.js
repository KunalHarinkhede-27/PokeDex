const IORedis = require('ioredis');

class InMemoryCache {
  constructor({ ttl = 1000 * 60 * 5, maxEntries = 500 } = {}) {
    this.ttl = ttl;
    this.maxEntries = maxEntries;
    this.map = new Map();
  }
  _isExpired(entry) { return Date.now() > entry.expiresAt; }
  async get(key) {
    const entry = this.map.get(key);
    if (!entry) return null;
    if (this._isExpired(entry)) { this.map.delete(key); return null; }
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }
  async set(key, value) {
    if (this.map.size >= this.maxEntries) {
      const firstKey = this.map.keys().next().value;
      if (firstKey) this.map.delete(firstKey);
    }
    this.map.set(key, { value, expiresAt: Date.now() + this.ttl });
  }
  async del(key) { this.map.delete(key); }
  async clear() { this.map.clear(); }
  async stats() { return { entries: this.map.size }; }
}

class RedisCache {
  constructor({ url, ttl = 1000 * 60 * 5 } = {}) {
    this.ttl = Math.floor(ttl/1000); 
    this.client = new IORedis(url);
  }
  async get(key) {
    const v = await this.client.get(key);
    if (!v) return null;
    try { return JSON.parse(v); } catch(e){ return v; }
  }
  async set(key, value) {
    await this.client.set(key, JSON.stringify(value), 'EX', this.ttl);
  }
  async del(key) { await this.client.del(key); }
  async clear() { await this.client.flushdb(); }
  async stats() { const info = await this.client.info(); return { info }; }
}

function createCache(opts = {}) {
  const redisUrl = process.env.REDIS_URL || opts.redisUrl;
  if (redisUrl) {
    try {
      const r = new RedisCache({ url: redisUrl, ttl: opts.ttl });
      console.log('Using Redis cache backend');
      return r;
    } catch (e) {
      console.warn('Redis init failed, falling back to memory cache', e.message);
    }
  }
  return new InMemoryCache(opts);
}

module.exports = { createCache };
