'use strict';

const goals = {
  OUTCOME_TRAFFIC: ['LINK_CLICKS', 'LANDING_PAGE_VIEWS'],
  OUTCOME_ENGAGEMENT: ['POST_ENGAGEMENT'],
  OUTCOME_AWARENESS: ['REACH', 'IMPRESSIONS'],
  OUTCOME_SALES: ['OFFSITE_CONVERSIONS'],
};

function validateCampaign(body) {
  if (!body || typeof body !== 'object') return "Campaign settings are required.";
  if (!goals[body.objective]?.includes(body.optimizationGoal)) return "Choose an optimization goal that matches the objective.";
  if (!/^\d+$/.test(body.pageId || '') || !/^\d+(?:_\d+)?$/.test(body.postId || '')) return "Choose a valid Page and post.";
  if (body.postId.includes('_') && !body.postId.startsWith(`${body.pageId}_`)) return "This post does not belong to the Page.";
  if (!Array.isArray(body.countries) || !body.countries.length || body.countries.some(c => !/^[A-Z]{2}$/.test(c))) return "Choose at least one valid country.";
  if (!Number.isInteger(Number(body.ageMin)) || !Number.isInteger(Number(body.ageMax)) || Number(body.ageMin) < 18 || Number(body.ageMax) > 65 || Number(body.ageMin) > Number(body.ageMax)) return "Check the age range (18 to 65).";
  if (!['0', '1', '2'].includes(String(body.gender))) return "Invalid gender selection.";
  if (!['daily', 'lifetime'].includes(body.budgetType) || !Number.isFinite(Number(body.budget)) || Number(body.budget) <= 0) return "Enter a valid budget.";
  if (!body.startDate || !Number.isFinite(Date.parse(body.startDate))) return "Enter a valid start date.";
  if (body.budgetType === 'lifetime' && !body.endDate) return "A lifetime budget needs an end date.";
  if (body.endDate && (!Number.isFinite(Date.parse(body.endDate)) || Date.parse(body.endDate) <= Date.parse(body.startDate))) return "The end date must be after the start date.";
  if (body.objective === 'OUTCOME_SALES' && !/^\d+$/.test(body.pixelId || '')) return "Choose a pixel for purchase conversions.";
  if (typeof body.publishNow !== 'boolean') return "Choose whether to publish or save paused.";
  if (body.interests !== undefined && (!Array.isArray(body.interests) || body.interests.some(i => !i || !/^\d+$/.test(i.id || '') || typeof i.name !== 'string'))) return "Check the selected interests.";
  const p = body.placements;
  if (!p || !Array.isArray(p.platforms) || !p.platforms.length || p.platforms.some(x => !['facebook', 'instagram'].includes(x))) return "Choose a placement.";
  for (const platform of p.platforms) {
    const positions = p[`${platform}_positions`];
    if (!Array.isArray(positions) || !positions.length) return "Choose a placement for each platform.";
    const allowed = platform === 'facebook' ? ['feed'] : ['stream', 'story', 'reels'];
    if (positions.some(position => !allowed.includes(position))) return "Invalid placement.";
  }
  return null;
}

module.exports = { validateCampaign, goals };
