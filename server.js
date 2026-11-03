// server.js
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const axios = require('axios');
const meta = require('./services/metaApi');

const app = express();
const PORT = process.env.PORT || 3000;
const campaignRequests = new Set();
const API_VERSION = process.env.META_API_VERSION || 'v26.0';

app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use((req, res, next) => {
  if (req.method === 'POST' && req.headers.origin && req.headers.origin !== `${req.protocol}://${req.get('host')}`) {
    return res.status(403).json({ error: { message: "Origin not allowed." } });
  }
  next();
});
app.get('/vendor/gsap.min.js', (req, res) => res.sendFile(require.resolve('gsap/dist/gsap.min.js')));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 },
}));

function requireAuth(req, res, next) {
  if (!req.session.accessToken || Date.now() >= req.session.tokenExpires) {
    return res.status(401).json({ error: { message: "Not authenticated. Sign in first." } });
  }
  next();
}

// OAuth
app.get('/auth/login', (req, res) => {
  const { META_APP_ID, REDIRECT_URI } = process.env;
  if (!configuration().configured) {
    return res.redirect('/?auth_error=' + encodeURIComponent("Set META_APP_ID, META_APP_SECRET, and REDIRECT_URI in .env, then restart the app."));
  }
  const scopes = [
    'public_profile','email','pages_show_list','pages_read_engagement',
    'pages_read_user_content','ads_read','ads_management','instagram_basic',
    'instagram_manage_insights','read_insights','business_management',
  ].join(',');
  req.session.oauthState = crypto.randomBytes(32).toString('hex');
  const url = `https://www.facebook.com/${API_VERSION}/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopes}&response_type=code&state=${req.session.oauthState}`;
  req.session.save(err => err ? res.status(500).send("Could not start a session.") : res.redirect(url));
});

app.get('/auth/callback', async (req, res) => {
  const { code, error, error_description, state } = req.query;
  const expected = req.session.oauthState;
  delete req.session.oauthState;
  if (typeof state !== 'string' || !expected || state !== expected) {
    return res.redirect('/?auth_error=' + encodeURIComponent("This connection expired or is not valid. Connect Facebook again."));
  }
  if (error) return res.redirect(`/?auth_error=${encodeURIComponent(error_description || error)}`);
  if (!code) return res.redirect("/?auth_error=No authorization code received");
  const { META_APP_ID, META_APP_SECRET, REDIRECT_URI } = process.env;
  try {
    const r1 = await axios.get(`https://graph.facebook.com/${API_VERSION}/oauth/access_token`, {
      params: { client_id: META_APP_ID, client_secret: META_APP_SECRET, redirect_uri: REDIRECT_URI, code },
    });
    const r2 = await axios.get(`https://graph.facebook.com/${API_VERSION}/oauth/access_token`, {
      params: { grant_type: 'fb_exchange_token', client_id: META_APP_ID, client_secret: META_APP_SECRET, fb_exchange_token: r1.data.access_token },
    });
    await new Promise((resolve, reject) => req.session.regenerate(err => err ? reject(err) : resolve()));
    req.session.accessToken = r2.data.access_token;
    req.session.tokenExpires = Date.now() + (r2.data.expires_in || 5183944) * 1000;
    req.session.save(err => res.redirect(err ? '/?auth_error=No%20se%20pudo%20guardar%20la%20sesion' : '/?auth=success'));
  } catch (err) {
    res.redirect(`/?auth_error=${encodeURIComponent(err.response?.data?.error?.message || err.message)}`);
  }
});

app.post('/auth/logout', (req, res) => { req.session.destroy(); res.json({ ok: true }); });
function configuration() {
  const keys = ['META_APP_ID', 'META_APP_SECRET', 'REDIRECT_URI'];
  const missing = keys.filter(key => !process.env[key] || /your_|change_this/.test(process.env[key]));
  return { configured: missing.length === 0, missing };
}
app.get('/auth/status', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ authenticated: !!req.session.accessToken && Date.now() < req.session.tokenExpires,
    tokenExpires: req.session.tokenExpires || null, ...configuration() });
});

// API
app.get('/api/me', requireAuth, async (req, res) => {
  const { data, error } = await meta.getMe(req.session.accessToken);
  if (error) return res.status(400).json({ error }); res.json(data);
});

app.get('/api/pages', requireAuth, async (req, res) => {
  const { data, error } = await meta.getPages(req.session.accessToken);
  if (error) return res.status(400).json({ error });
  res.json({ data: (data.data || []).map(({ access_token, ...page }) => page) });
});

app.get('/api/pages/:pageId/instagram', requireAuth, async (req, res) => {
  const pages = await meta.getPages(req.session.accessToken);
  if (pages.error) return res.status(400).json({ error: pages.error });
  const page = pages.data?.data?.find(p => p.id === req.params.pageId);
  if (!page) return res.status(404).json({ error: { message: "Page not found" } });
  const { data, error } = await meta.getInstagramAccount(page.id, page.access_token);
  if (error) return res.status(400).json({ error }); res.json(data);
});

app.get('/api/adaccounts', requireAuth, async (req, res) => {
  const { data, error } = await meta.getAdAccounts(req.session.accessToken);
  if (error) return res.status(400).json({ error }); res.json(data);
});

app.get('/api/pages/:pageId/posts', requireAuth, async (req, res) => {
  const pages = await meta.getPages(req.session.accessToken);
  if (pages.error) return res.status(400).json({ error: pages.error });
  const page = pages.data?.data?.find(p => p.id === req.params.pageId);
  if (!page) return res.status(404).json({ error: { message: "Page not found" } });
  const { data, error } = await meta.getPagePosts(page.id, page.access_token, parseInt(req.query.limit) || 10);
  if (error) return res.status(400).json({ error }); res.json(data);
});

app.get('/api/posts/:postId/insights', requireAuth, async (req, res) => {
  const { pageId } = req.query;
  if (!pageId) return res.status(400).json({ error: { message: "pageId is required" } });
  const pages = await meta.getPages(req.session.accessToken);
  if (pages.error) return res.status(400).json({ error: pages.error });
  const page = pages.data?.data?.find(p => p.id === pageId);
  if (!page) return res.status(404).json({ error: { message: "Page not found" } });
  const [insights, reactions] = await Promise.all([
    meta.getPostInsights(req.params.postId, page.access_token),
    meta.getPostReactions(req.params.postId, page.access_token),
  ]);
  res.json({ insights: insights.data, reactions: reactions.data, insightsError: insights.error, reactionsError: reactions.error });
});

app.get('/api/instagram/:igAccountId/media', requireAuth, async (req, res) => {
  const { pageId } = req.query;
  const pages = await meta.getPages(req.session.accessToken);
  const page = pages.data?.data?.find(p => p.id === pageId);
  if (!page) return res.status(404).json({ error: { message: "Page not found" } });
  const { data, error } = await meta.getInstagramMedia(req.params.igAccountId, page.access_token);
  if (error) return res.status(400).json({ error }); res.json(data);
});

app.get('/api/interests/search', requireAuth, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: { message: "q is required" } });
  const { data, error } = await meta.searchInterests(q, req.session.accessToken);
  if (error) return res.status(400).json({ error }); res.json(data);
});

app.get('/api/adaccounts/:adAccountId/pixels', requireAuth, async (req, res) => {
  const { data, error } = await meta.getPixels(req.params.adAccountId, req.session.accessToken);
  if (error) return res.status(400).json({ error }); res.json(data);
});

app.get('/api/adaccounts/:adAccountId/campaigns', requireAuth, async (req, res) => {
  const { data, error } = await meta.getCampaigns(req.params.adAccountId, req.session.accessToken);
  if (error) return res.status(400).json({ error }); res.json(data);
});

app.get('/api/campaigns/:campaignId/insights', requireAuth, async (req, res) => {
  const { data, error } = await meta.getCampaignInsights(req.params.campaignId, req.session.accessToken);
  if (error) return res.status(400).json({ error }); res.json(data);
});

app.post('/api/adaccounts/:adAccountId/create-campaign', requireAuth, async (req, res) => {
  const adAccountId = req.params.adAccountId;
  const token = req.session.accessToken;
  const body = req.body;
  const { validateCampaign } = require('./services/validateCampaign');
  const validation = validateCampaign(body);
  if (validation) return res.status(400).json({ error: { message: validation } });
  if (campaignRequests.has(req.sessionID)) return res.status(409).json({ error: { message: "A campaign is already being created. Wait for the result." } });
  campaignRequests.add(req.sessionID);
  const requestSession = req.sessionID;
  res.on('finish', () => campaignRequests.delete(requestSession));
  const results = { campaign: null, adSet: null, creative: null, ad: null, errors: [] };

  const campaignRes = await meta.createCampaign(adAccountId, token, {
    name: body.campaignName || `Campaign ${new Date().toLocaleDateString("en-US")}`,
    objective: body.objective,
    status: 'PAUSED',
    special_ad_categories: [],
  });
  if (campaignRes.error) { results.errors.push({ step: 'campaign', error: campaignRes.error }); return res.status(400).json({ ...results, error: { ...results.errors[0].error, message: `Failed at ${results.errors[0].step}: ${results.errors[0].error.message}. Created components remain paused. Check them in Meta Ads Manager before retrying.` } }); }
  results.campaign = campaignRes.data;

  const targeting = {
    geo_locations: { countries: body.countries || ['AR'] },
    age_min: parseInt(body.ageMin) || 18,
    age_max: parseInt(body.ageMax) || 65,
  };
  if (body.gender && body.gender !== '0') targeting.genders = [parseInt(body.gender)];
  if (body.interests?.length) targeting.flexible_spec = [{ interests: body.interests.map(i => ({ id: i.id, name: i.name })) }];
  if (body.placements) {
    targeting.publisher_platforms = body.placements.platforms || ['facebook', 'instagram'];
    if (body.placements.facebook_positions?.length) targeting.facebook_positions = body.placements.facebook_positions;
    if (body.placements.instagram_positions?.length) targeting.instagram_positions = body.placements.instagram_positions;
  }

  const adSetParams = {
    name: body.adSetName || `Ad Set - ${(body.countries || ['AR']).join(', ')}`,
    campaign_id: results.campaign.id,
    optimization_goal: body.optimizationGoal || 'REACH',
    billing_event: 'IMPRESSIONS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    targeting,
    start_time: body.startDate ? new Date(body.startDate).toISOString() : new Date().toISOString(),
    status: 'PAUSED',
  };
  if (body.budgetType === 'daily') adSetParams.daily_budget = Math.round(parseFloat(body.budget) * 100);
  else adSetParams.lifetime_budget = Math.round(parseFloat(body.budget) * 100);
  if (body.endDate) adSetParams.end_time = new Date(body.endDate).toISOString();

  if (body.pixelId) adSetParams.promoted_object = { pixel_id: body.pixelId, custom_event_type: 'PURCHASE' };

  const adSetRes = await meta.createAdSet(adAccountId, token, adSetParams);
  if (adSetRes.error) { results.errors.push({ step: 'adset', error: adSetRes.error }); return res.status(400).json({ ...results, error: { ...results.errors[0].error, message: `Failed at ${results.errors[0].step}: ${results.errors[0].error.message}. Created components remain paused. Check them in Meta Ads Manager before retrying.` } }); }
  results.adSet = adSetRes.data;

  const creativeRes = await meta.createAdCreative(adAccountId, token, {
    name: body.creativeName || 'Creative',
    page_id: body.pageId,
    post_id: body.postId,
    message: body.message,
    link: body.destinationUrl,
    cta_type: body.ctaType || 'LEARN_MORE',
    cta_link: body.destinationUrl,
  });
  if (creativeRes.error) { results.errors.push({ step: 'creative', error: creativeRes.error }); return res.status(400).json({ ...results, error: { ...results.errors[0].error, message: `Failed at ${results.errors[0].step}: ${results.errors[0].error.message}. Created components remain paused. Check them in Meta Ads Manager before retrying.` } }); }
  results.creative = creativeRes.data;

  const adRes = await meta.createAd(adAccountId, token, {
    name: body.adName || "Ad",
    adset_id: results.adSet.id,
    creative_id: results.creative.id,
    status: 'PAUSED',
  });
  if (adRes.error) { results.errors.push({ step: 'ad', error: adRes.error }); return res.status(400).json({ ...results, error: { ...results.errors[0].error, message: `Failed at ${results.errors[0].step}: ${results.errors[0].error.message}. Created components remain paused. Check them in Meta Ads Manager before retrying.` } }); }
  results.ad = adRes.data;

  if (body.publishNow) {
    for (const [step, id] of [['ad', results.ad.id], ['adset', results.adSet.id], ['campaign', results.campaign.id]]) {
      const activated = await meta.updateStatus(id, token, 'ACTIVE');
      if (activated.error) return res.status(400).json({ ...results, error: { ...activated.error, message: `Could not activate ${step}: ${activated.error.message}. Check the IDs in Meta Ads Manager.` } });
    }
  }
  console.log(`[Campaign] campaign=${results.campaign.id} adset=${results.adSet.id} ad=${results.ad.id}`);
  res.json(results);
});

app.use('/api', (req, res) => res.status(404).json({ error: { message: "Route not found." } }));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

if (require.main === module) app.listen(PORT, process.env.HOST || '127.0.0.1', () => {
  console.log(`\n✅ Meta Ads Manager → http://localhost:${PORT}`);
  console.log(`   APP_ID: ${process.env.META_APP_ID ? '✓ ' + process.env.META_APP_ID : "✗ Missing from .env"}`);
  console.log(`   REDIRECT_URI: ${process.env.REDIRECT_URI || "✗ Missing from .env"}\n`);
});

module.exports = app;
