// services/metaApi.js
// Wrapper for the Meta Graph API and Marketing API.
// Documentation: https://developers.facebook.com/docs/marketing-apis

const axios = require('axios').create({ timeout: 20000 });

const API_VERSION = process.env.META_API_VERSION || 'v26.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

// --- Helpers ---

async function get(endpoint, accessToken, params = {}) {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params: { access_token: accessToken, ...params },
    });
    if (response.data.paging) {
      const paging = response.data.paging;
      response.data.paging = { cursors: paging.cursors, has_next: !!paging.next };
    }
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: parseMetaError(err) };
  }
}

async function post(endpoint, accessToken, body = {}) {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, {
      access_token: accessToken,
      ...body,
    });
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: parseMetaError(err) };
  }
}

function parseMetaError(err) {
  if (err.response?.data?.error) {
    const e = err.response.data.error;
    return {
      message: e.message,
      type: e.type,
      code: e.code,
      subcode: e.error_subcode,
      fbtrace: e.fbtrace_id,
    };
  }
  return { message: err.message, type: 'NetworkError', code: null };
}

async function getAll(endpoint, token, params) {
  const items = [];
  const seen = new Set();
  let after;
  do {
    const result = await get(endpoint, token, { ...params, limit: 100, ...(after ? { after } : {}) });
    if (result.error) return result;
    items.push(...(result.data.data || []));
    const paging = result.data.paging;
    after = paging?.has_next ? paging.cursors?.after : null;
    if (after && seen.has(after)) return { data: null, error: { message: "Meta returned a repeated pagination cursor." } };
    seen.add(after);
  } while (after);
  return { data: { data: items }, error: null };
}

// --- Auth & User ---

async function getMe(accessToken) {
  return get('/me', accessToken, { fields: 'id,name,email,picture' });
}

async function getPages(accessToken) {
  return getAll('/me/accounts', accessToken, {
    fields: 'id,name,access_token,instagram_business_account,category,picture',
  });
}

async function getInstagramAccount(pageId, pageAccessToken) {
  return get(`/${pageId}`, pageAccessToken, {
    fields: 'instagram_business_account{id,username,profile_picture_url,followers_count}',
  });
}

async function getAdAccounts(accessToken) {
  return getAll('/me/adaccounts', accessToken, {
    fields: 'id,name,account_status,currency,timezone_name,business',
  });
}

// --- Content & Insights ---

async function getPagePosts(pageId, pageAccessToken, limit = 10) {
  return get(`/${pageId}/posts`, pageAccessToken, {
    fields: 'id,message,story,created_time,full_picture,permalink_url,type,attachments{media_type,media,title,description}',
    limit,
  });
}

async function getPostInsights(postId, pageAccessToken) {
  // Available organic metrics depend on the post type and API version.
  const metrics = [
    'post_impressions',
    'post_impressions_unique',
    'post_engaged_users',
    'post_clicks',
    'post_reactions_by_type_total',
  ].join(',');

  return get(`/${postId}/insights`, pageAccessToken, { metric: metrics });
}

async function getPostReactions(postId, pageAccessToken) {
  return get(`/${postId}`, pageAccessToken, {
    fields: 'reactions.summary(true),comments.summary(true),shares',
  });
}

async function getInstagramMedia(igAccountId, pageAccessToken, limit = 10) {
  return get(`/${igAccountId}/media`, pageAccessToken, {
    fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,like_count,comments_count',
    limit,
  });
}

async function getInstagramMediaInsights(mediaId, pageAccessToken) {
  // Available insights depend on media_type.
  return get(`/${mediaId}/insights`, pageAccessToken, {
    metric: 'impressions,reach,engagement,saved',
  });
}

// --- Interests & Targeting ---

async function searchInterests(query, accessToken, adAccountId) {
  return get('/search', accessToken, {
    type: 'adinterest',
    q: query,
  });
}

async function getTargetingCategories(accessToken, adAccountId) {
  return get(`/${adAccountId}/targetingbrowse`, accessToken, {});
}

// --- Pixels ---

async function getPixels(adAccountId, accessToken) {
  return get(`/${adAccountId}/adspixels`, accessToken, {
    fields: 'id,name,creation_time,last_fired_time,code',
  });
}

// --- Campaigns ---

async function getCampaigns(adAccountId, accessToken) {
  return get(`/${adAccountId}/campaigns`, accessToken, {
    fields: 'id,name,status,objective,created_time,start_time,stop_time,daily_budget,lifetime_budget,budget_remaining',
    limit: 20,
  });
}

async function getCampaignInsights(campaignId, accessToken) {
  return get(`/${campaignId}/insights`, accessToken, {
    fields: 'spend,impressions,reach,clicks,cpc,cpm,ctr,actions,action_values,purchase_roas',
    date_preset: 'last_30d',
  });
}

async function createCampaign(adAccountId, accessToken, params) {
  /* Campaign fields: name, objective, status, and special_ad_categories. Uses OUTCOME_* objectives. */
  return post(`/${adAccountId}/campaigns`, accessToken, {
    name: params.name,
    objective: params.objective,
    status: params.status || 'PAUSED', // Paused by default.
    special_ad_categories: params.special_ad_categories || [],
    is_adset_budget_sharing_enabled: false,
  });
}

async function createAdSet(adAccountId, accessToken, params) {
  /*
    params: {
      name, campaign_id, daily_budget | lifetime_budget,
      start_time, end_time, targeting, optimization_goal,
      billing_event, bid_strategy, status
    }
  */

  const body = {
    name: params.name,
    campaign_id: params.campaign_id,
    status: params.status || 'PAUSED',
    optimization_goal: params.optimization_goal,
    billing_event: params.billing_event || 'IMPRESSIONS',
    targeting: params.targeting,
    start_time: params.start_time,
  };

  if (params.daily_budget) body.daily_budget = params.daily_budget;
  if (params.lifetime_budget) body.lifetime_budget = params.lifetime_budget;
  if (params.end_time) body.end_time = params.end_time;
  if (params.promoted_object) body.promoted_object = params.promoted_object;
  if (params.bid_strategy) body.bid_strategy = params.bid_strategy;

  return post(`/${adAccountId}/adsets`, accessToken, body);
}

async function createAdCreative(adAccountId, accessToken, params) {
  /*
    params: {
      name, page_id, post_id (existing post),
      OR: message, image_url, link, call_to_action
    }
  */

  let body = { name: params.name };

  if (params.post_id) {
    // Use an existing Page post.
    body.object_story_id = params.post_id.includes('_') ? params.post_id : `${params.page_id}_${params.post_id}`;
  } else {
    // Create a new creative.
    body.object_story_spec = {
      page_id: params.page_id,
      link_data: {
        message: params.message,
        link: params.link,
        picture: params.image_url,
        call_to_action: {
          type: params.cta_type || 'LEARN_MORE',
          value: params.cta_link ? { link: params.cta_link } : undefined,
        },
      },
    };
  }

  return post(`/${adAccountId}/adcreatives`, accessToken, body);
}

async function createAd(adAccountId, accessToken, params) {
  /*
    params: {
      name, adset_id, creative_id, status
    }
  */
  return post(`/${adAccountId}/ads`, accessToken, {
    name: params.name,
    adset_id: params.adset_id,
    creative: { creative_id: params.creative_id },
    status: params.status || 'PAUSED',
  });
}

async function getAdSetInsights(adSetId, accessToken) {
  return get(`/${adSetId}/insights`, accessToken, {
    fields: 'spend,impressions,reach,clicks,cpc,cpm,ctr,actions,purchase_roas',
    date_preset: 'last_30d',
  });
}

// --- Exchange short-lived token for long-lived token ---
async function exchangeToken(shortLivedToken) {
  const { META_APP_ID, META_APP_SECRET } = process.env;
  return get('/oauth/access_token', shortLivedToken, {
    grant_type: 'fb_exchange_token',
    client_id: META_APP_ID,
    client_secret: META_APP_SECRET,
    fb_exchange_token: shortLivedToken,
  });
}

async function updateStatus(id, token, status) {
  return post(`/${id}`, token, { status });
}

module.exports = {
  updateStatus,
  getMe,
  getPages,
  getInstagramAccount,
  getAdAccounts,
  getPagePosts,
  getPostInsights,
  getPostReactions,
  getInstagramMedia,
  getInstagramMediaInsights,
  searchInterests,
  getTargetingCategories,
  getPixels,
  getCampaigns,
  getCampaignInsights,
  createCampaign,
  createAdSet,
  createAdCreative,
  createAd,
  getAdSetInsights,
  exchangeToken,
};
