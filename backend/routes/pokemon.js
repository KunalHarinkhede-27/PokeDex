const express = require('express');
const axios = require('axios');
const { createCache } = require('../services/cache');

const router = express.Router();
const cache = createCache({ ttl: 1000 * 60 * 10, maxEntries: 1000 });
const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

async function fetchAndCache(key, url) {
  const cached = await cache.get(key);
  if (cached) return { cached: true, data: cached };
  const res = await axios.get(url, { timeout: 10000 });
  await cache.set(key, res.data);
  return { cached: false, data: res.data };
}

// GET /api/pokemon/:identifier
router.get('/pokemon/:identifier', async (req, res) => {
  try {
    const id = req.params.identifier.toString().toLowerCase().trim();
    const key = `pokemon::${id}`;
    const url = `${POKEAPI_BASE}/pokemon/${encodeURIComponent(id)}`;
    const result = await fetchAndCache(key, url);
    return res.json({ cached: result.cached, servedAt: new Date().toISOString(), data: result.data });
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'Pokemon not found' });
    console.error('pokemon err', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/species/:identifier
router.get('/species/:identifier', async (req, res) => {
  try {
    const id = req.params.identifier.toString().toLowerCase().trim();
    const key = `species::${id}`;
    const url = `${POKEAPI_BASE}/pokemon-species/${encodeURIComponent(id)}`;
    const result = await fetchAndCache(key, url);
    return res.json({ cached: result.cached, servedAt: new Date().toISOString(), data: result.data });
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'Species not found' });
    console.error('species err', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/evolution/:id
router.get('/evolution/:id', async (req, res) => {
  try {
    const id = req.params.id.toString().trim();
    const key = `evo::${id}`;
    const url = `${POKEAPI_BASE}/evolution-chain/${encodeURIComponent(id)}`;
    const result = await fetchAndCache(key, url);
    return res.json({ cached: result.cached, servedAt: new Date().toISOString(), data: result.data });
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'Evolution chain not found' });
    console.error('evo err', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin
router.get('/admin/cache/stats', async (req, res) => {
  try {
    const s = await cache.stats();
    res.json({ ok: true, stats: s });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/admin/cache/clear', async (req, res) => {
  try {
    await cache.clear();
    res.json({ ok: true, cleared: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// health
router.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

module.exports = router;
