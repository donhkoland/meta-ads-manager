const { test } = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
delete process.env.META_APP_ID;
delete process.env.META_APP_SECRET;
process.env.REDIRECT_URI = 'http://localhost:3000/auth/callback';
const app = require('../server');
const meta = require('../services/metaApi');
const { validateCampaign } = require('../services/validateCampaign');

const valid = {
  objective: 'OUTCOME_TRAFFIC', optimizationGoal: 'LINK_CLICKS', pageId: '123', postId: '456',
  countries: ['AR'], ageMin: 18, ageMax: 65, gender: '0', budgetType: 'daily', budget: 10,
  startDate: '2030-01-01T12:00', placements: { platforms: ['facebook'], facebook_positions: ['feed'] },
  publishNow: false,
};

test('rejects invalid budgets, dates, objectives and unrelated posts before creation', () => {
  assert.equal(validateCampaign(valid), null);
  for (const patch of [{ budget: 'NaN' }, { startDate: 'bad' }, { ageMin: 66 },
    { postId: '999_456' }, { budgetType: 'lifetime' }, { objective: 'OUTCOME_SALES' },
    { endDate: '2020-01-01' }, { placements: { platforms: [] } }]) {
    assert.ok(validateCampaign({ ...valid, ...patch }));
  }
});

test('HTTP app, OAuth, token privacy and campaign lifecycle with mocked Meta', async t => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (url, opts = {}) => fetch(base + url, { redirect: 'manual', ...opts });
  for (const path of ['/', '/app.js', '/styles.css', '/vendor/gsap.min.js']) {
    assert.equal((await request(path)).status, 200, path);
  }
  for (const path of ['/.env', '/server.js', '/package.json']) {
    const response = await request(path);
    assert.match(response.headers.get('content-type'), /text\/html/);
  }
  assert.equal((await request('/api/pages')).status, 401);
  assert.equal((await request('/api/unknown')).status, 404);
  assert.equal((await request('/auth/logout', { method: 'POST', headers: { origin: 'https://other.test' } })).status, 403);
  assert.equal((await (await request('/auth/status')).json()).configured, false);
  process.env.META_APP_ID = '123';
  process.env.META_APP_SECRET = 'test-secret';
  const login = await request('/auth/login');
  assert.equal(login.status, 302);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const state = new URL(login.headers.get('location')).searchParams.get('state');
  assert.ok(state);
  const invalid = await request('/auth/callback?code=x&state=bad', { headers: { cookie } });
  assert.match(invalid.headers.get('location'), /auth_error/);
  const login2 = await request('/auth/login');
  const cookie2 = login2.headers.get('set-cookie').split(';')[0];
  const state2 = new URL(login2.headers.get('location')).searchParams.get('state');
  t.mock.method(axios, 'get', async () => ({ data: { access_token: 'private-token', expires_in: 3600 } }));
  const callback = await request(`/auth/callback?code=x&state=${state2}`, { headers: { cookie: cookie2 } });
  assert.equal(callback.headers.get('location'), '/?auth=success');
  const sessionCookie = callback.headers.get('set-cookie').split(';')[0];
  const headers = { cookie: sessionCookie, 'Content-Type': 'application/json' };
  t.mock.method(meta, 'getPages', async () => ({ data: { data: [{ id: '123', name: 'Page', access_token: 'page-secret' }] } }));
  const pages = await (await request('/api/pages', { headers })).text();
  assert.ok(!pages.includes('page-secret'));
  let failStep;
  const calls = [];
  for (const [method, id] of [['createCampaign', 'campaign'], ['createAdSet', 'adset'], ['createAdCreative', 'creative'], ['createAd', 'ad']]) {
    t.mock.method(meta, method, async (account, token, body) => {
      calls.push({ method, body });
      return failStep === method ? { error: { message: 'Mock failure', code: 100 } } : { data: { id } };
    });
  }
  t.mock.method(meta, 'updateStatus', async (id, token, status) => { calls.push({ id, status }); return { data: { success: true } }; });
  const create = body => request('/api/adaccounts/act_1/create-campaign', { method: 'POST', headers, body: JSON.stringify(body) });
  assert.equal((await create({ ...valid, budget: -1 })).status, 400);
  assert.equal(calls.length, 0);
  assert.equal((await create(valid)).status, 200);
  assert.equal(calls.length, 4);
  assert.ok(calls.filter(c => c.body?.status).every(c => c.body.status === 'PAUSED'));
  calls.length = 0;
  failStep = 'createAdSet';
  const failed = await create({ ...valid, publishNow: true });
  assert.equal(failed.status, 400);
  const partial = await failed.json();
  assert.equal(partial.campaign.id, 'campaign');
  assert.match(partial.error.message, /Mock failure/);
  assert.equal(calls.length, 2);
  calls.length = 0;
  failStep = null;
  assert.equal((await create({ ...valid, publishNow: true })).status, 200);
  assert.deepEqual(calls.slice(4).map(c => c.id), ['ad', 'adset', 'campaign']);
});
