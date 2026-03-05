import type { ChatResponse, QueryEngine } from './chatTypes';
import { STATE_NAMES } from '@/lib/stateAggregation';
import {
  executiveSummary,
  collectionsData,
  originationsData,
  portfolioHealthData,
  creditRiskData,
  salesData,
  merchantProfiles,
  repScorecard,
  enrollmentReps,
  enrollmentsByState,
  delinquencyByIndustry,
  approvalRateByIndustry,
  territoryPerformance,
  topMerchantsByVolume,
  fpdByChannel,
  branchDetails,
  creditScoreDistribution,
  autoPayVsManualDelinquency,
  enrollmentOverview,
} from '@/data/mockData';

// ── Intent types ──
type Intent =
  | 'MERCHANT_LOOKUP' | 'MERCHANT_TOP' | 'MERCHANT_RISK'
  | 'REP_LOOKUP' | 'REP_LEADERBOARD'
  | 'TERRITORY_LOOKUP' | 'TERRITORY_COMPARE'
  | 'KPI_QUERY' | 'COLLECTIONS_QUERY' | 'ORIGINATIONS_QUERY'
  | 'STATE_LOOKUP' | 'STATE_ENROLLMENT'
  | 'INDUSTRY_ANALYSIS' | 'PORTFOLIO_QUERY' | 'CREDIT_RISK_QUERY'
  | 'EXECUTIVE_SUMMARY' | 'HELP' | 'UNKNOWN';

type Entities = {
  states?: string[];
  territories?: string[];
  repNames?: string[];
  industries?: string[];
  statuses?: string[];
  tiers?: string[];
  sortBy?: string;
  limit?: number;
};

// ── Lookups ──
const STATE_CODES: Record<string, string> = {};
const STATE_NAME_LOWER: Record<string, string> = {};
for (const [code, name] of Object.entries(STATE_NAMES)) {
  STATE_CODES[name.toLowerCase()] = code;
  STATE_NAME_LOWER[code.toLowerCase()] = code;
}

const ALL_REPS = [
  ...repScorecard.map(r => ({ name: r.name, source: 'sales' as const })),
  ...enrollmentReps.map(r => ({ name: r.name, source: 'enrollment' as const })),
];

const INDUSTRIES = ['auto', 'furniture', 'jewelry', 'electronics', 'home services', 'pets', 'dental', 'veterinary', 'fitness'];
const STATUSES = ['active', 'dormant', 'suspended', 'terminated'];
const TIERS = ['platinum', 'gold', 'silver', 'bronze'];

// ── Entity Extraction ──
function extractEntities(input: string): Entities {
  const entities: Entities = {};

  // States
  const foundStates: string[] = [];
  for (const [name, code] of Object.entries(STATE_CODES)) {
    if (input.includes(name)) foundStates.push(code);
  }
  for (const [codeLower, code] of Object.entries(STATE_NAME_LOWER)) {
    const regex = new RegExp(`\\b${codeLower}\\b`);
    if (regex.test(input) && !foundStates.includes(code)) foundStates.push(code);
  }
  // Also match 2-letter uppercase codes in original
  const codeMatch = input.match(/\b([A-Z]{2})\b/gi);
  if (codeMatch) {
    for (const m of codeMatch) {
      const upper = m.toUpperCase();
      if (STATE_NAMES[upper] && !foundStates.includes(upper)) foundStates.push(upper);
    }
  }
  if (foundStates.length) entities.states = foundStates;

  // Territories
  const terrMatch = input.match(/ric[- ]?(\d)/gi);
  if (terrMatch) {
    entities.territories = terrMatch.map(t => {
      const num = t.replace(/[^0-9]/g, '');
      return `RIC-${num}`;
    });
  }

  // Rep names (fuzzy first-name match)
  const foundReps: string[] = [];
  for (const rep of ALL_REPS) {
    const firstName = rep.name.split(' ')[0].toLowerCase();
    const lastName = rep.name.split(' ').slice(-1)[0].toLowerCase();
    const fullName = rep.name.toLowerCase();
    if (input.includes(fullName) || input.includes(firstName) || input.includes(lastName)) {
      if (!foundReps.includes(rep.name)) foundReps.push(rep.name);
    }
  }
  if (foundReps.length) entities.repNames = foundReps;

  // Industries
  const foundIndustries: string[] = [];
  for (const ind of INDUSTRIES) {
    if (input.includes(ind)) foundIndustries.push(ind);
  }
  if (foundIndustries.length) entities.industries = foundIndustries;

  // Statuses
  const foundStatuses: string[] = [];
  for (const s of STATUSES) { if (input.includes(s)) foundStatuses.push(s); }
  if (foundStatuses.length) entities.statuses = foundStatuses;

  // Tiers
  const foundTiers: string[] = [];
  for (const t of TIERS) { if (input.includes(t)) foundTiers.push(t); }
  if (foundTiers.length) entities.tiers = foundTiers;

  // Limit
  const limitMatch = input.match(/\b(?:top|first|best|worst)\s+(\d+)\b/);
  entities.limit = limitMatch ? parseInt(limitMatch[1]) : undefined;

  // Sort
  if (input.includes('volume')) entities.sortBy = 'volume';
  else if (input.includes('deal')) entities.sortBy = 'deals';
  else if (input.includes('approval')) entities.sortBy = 'approval';
  else if (input.includes('delinquen')) entities.sortBy = 'delinquency';

  return entities;
}

// ── Intent Detection ──
function detectIntent(input: string, entities: Entities): Intent {
  // Help
  if (/\b(help|what can you|what do you|how do i|commands?)\b/.test(input)) return 'HELP';

  // Executive summary
  if (/\b(summary|overview|how are we doing|dashboard|overall|big picture)\b/.test(input)) return 'EXECUTIVE_SUMMARY';

  // Territory - check before rep since territory codes are specific
  if (entities.territories?.length) return 'TERRITORY_LOOKUP';
  if (/\b(compare|rank|worst|best)\b.*\bterrit/.test(input) || /\bterrit.*\b(compare|rank|worst|best)\b/.test(input)) return 'TERRITORY_COMPARE';

  // Rep
  if (entities.repNames?.length) return 'REP_LOOKUP';
  if (/\b(top|best|rank|leader)\b.*\b(rep|osr|sales)\b/.test(input) || /\b(rep|osr|sales)\b.*\b(rank|leader|board)\b/.test(input)) return 'REP_LEADERBOARD';

  // State enrollment
  if (/\benroll/.test(input) && (/\bstate/.test(input) || entities.states?.length)) return 'STATE_ENROLLMENT';

  // State lookup
  if (entities.states?.length) return 'STATE_LOOKUP';

  // Merchant risk
  if (/\b(declin|at.?risk|struggling|problem|worst|delinquen|chargeback|fpd|risk)\b/.test(input) && /\bmerchant/.test(input)) return 'MERCHANT_RISK';
  if (/\b(declin|at.?risk|struggling|problem)\b/.test(input)) return 'MERCHANT_RISK';

  // Merchant top
  if (/\b(top|best|highest|leading|biggest)\b/.test(input) && /\bmerchant/.test(input)) return 'MERCHANT_TOP';

  // Merchant lookup
  if (/\bmerchant/.test(input) || entities.statuses?.length || entities.tiers?.length) return 'MERCHANT_LOOKUP';

  // Industry
  if (/\bindustr/.test(input) || (entities.industries?.length && !(/\bmerchant/.test(input)))) return 'INDUSTRY_ANALYSIS';

  // Collections
  if (/\b(collection|contact rate|ptp|promise.?to.?pay|cure rate|dpd|bucket|save rate)\b/.test(input)) return 'COLLECTIONS_QUERY';

  // Originations
  if (/\b(originat|fund|funding|funded|approval rate|approval funnel|auto.?pay attach)\b/.test(input)) return 'ORIGINATIONS_QUERY';

  // Portfolio
  if (/\b(portfolio|auto.?pay|manual pay)\b/.test(input)) return 'PORTFOLIO_QUERY';

  // Credit risk
  if (/\b(credit|fpd|first payment|credit score|vintage|charge.?off)\b/.test(input)) return 'CREDIT_RISK_QUERY';

  // KPI generic
  if (/\b(kpi|metric|rate|number|stat)\b/.test(input)) return 'KPI_QUERY';

  // Industry entities without the word "industry"
  if (entities.industries?.length) return 'INDUSTRY_ANALYSIS';

  return 'UNKNOWN';
}

// ── Response Builders ──
function fmt$(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

function merchantTable(merchants: typeof merchantProfiles, title: string): ChatResponse['data'] {
  return {
    type: 'table',
    title,
    headers: ['Merchant', 'Industry', 'State', 'Tier', 'Volume MTD', 'Approval %'],
    rows: merchants.map(m => [
      m.name, m.industry, m.state, m.tier, fmt$(m.volumeMTD), `${m.approvalRate}%`,
    ]),
  };
}

// ── Intent Handlers ──

function handleMerchantLookup(entities: Entities): ChatResponse {
  let results = [...merchantProfiles];
  const filters: string[] = [];

  if (entities.states?.length) {
    results = results.filter(m => entities.states!.includes(m.state));
    filters.push(`in ${entities.states.map(s => STATE_NAMES[s] || s).join(', ')}`);
  }
  if (entities.statuses?.length) {
    results = results.filter(m => entities.statuses!.includes(m.status.toLowerCase()));
    filters.push(`with status: ${entities.statuses.join(', ')}`);
  }
  if (entities.tiers?.length) {
    results = results.filter(m => entities.tiers!.includes(m.tier.toLowerCase()));
    filters.push(`tier: ${entities.tiers.join(', ')}`);
  }
  if (entities.industries?.length) {
    results = results.filter(m => entities.industries!.some(i => m.industry.toLowerCase().includes(i)));
    filters.push(`industry: ${entities.industries.join(', ')}`);
  }

  const filterDesc = filters.length ? filters.join(' ') : '';

  if (results.length === 0) {
    return {
      text: `Hmm, no merchants match that ${filterDesc}. We've got ${merchantProfiles.length} merchants across ${new Set(merchantProfiles.map(m => m.state)).size} states — try broadening your search?`,
      suggestions: ['Show all merchants', 'Which states have merchants?', 'Show dormant merchants'],
    };
  }

  const topByVol = results.sort((a, b) => b.volumeMTD - a.volumeMTD);
  const text = results.length === 1
    ? `Here's what I found — ${results[0].name} ${filterDesc}. They're a ${results[0].status.toLowerCase()} ${results[0].tier} merchant pulling ${fmt$(results[0].volumeMTD)} volume MTD.`
    : `I pulled up ${results.length} merchants ${filterDesc}. ${topByVol[0].name} is leading the pack with ${fmt$(topByVol[0].volumeMTD)} in volume.`;

  return {
    text,
    data: merchantTable(topByVol, `Merchants ${filterDesc}`),
    suggestions: [
      results.length > 1 ? `Which ${filterDesc} merchant has highest delinquency?` : `Show ${results[0].name} details`,
      'Top merchants by volume',
      'Show declining merchants',
    ],
  };
}

function handleMerchantTop(entities: Entities): ChatResponse {
  const limit = entities.limit || 5;
  const sortKey = entities.sortBy || 'volume';

  let sorted = [...merchantProfiles];
  if (sortKey === 'deals') sorted.sort((a, b) => b.dealsMTD - a.dealsMTD);
  else if (sortKey === 'approval') sorted.sort((a, b) => b.approvalRate - a.approvalRate);
  else sorted.sort((a, b) => b.volumeMTD - a.volumeMTD);

  const top = sorted.slice(0, limit);

  return {
    text: `Your top ${top.length} merchants by ${sortKey} — ${top[0].name} is crushing it with ${sortKey === 'volume' ? fmt$(top[0].volumeMTD) : sortKey === 'deals' ? `${top[0].dealsMTD} deals` : `${top[0].approvalRate}% approval`}.`,
    data: merchantTable(top, `Top ${top.length} Merchants by ${sortKey}`),
    suggestions: ['Show declining merchants', 'Merchants by industry', 'Which merchants are dormant?'],
  };
}

function handleMerchantRisk(_entities: Entities): ChatResponse {
  const declining = merchantProfiles.filter(m => {
    const vol = m.monthlyVolume;
    if (vol.length < 2) return false;
    return vol[vol.length - 1].volume < vol[0].volume;
  });

  const highDelinq = merchantProfiles.filter(m => m.delinquencyRate > 5).sort((a, b) => b.delinquencyRate - a.delinquencyRate);

  const riskMerchants = [...new Map([...declining, ...highDelinq].map(m => [m.id, m])).values()];

  if (riskMerchants.length === 0) {
    return {
      text: 'Good news — no merchants are flagged at-risk right now. Everyone is looking stable or growing!',
      suggestions: ['Show top merchants', 'Portfolio health overview', 'Delinquency by industry'],
    };
  }

  return {
    text: `Heads up — I'm seeing ${riskMerchants.length} merchants that need attention. ${declining.length} are trending down on volume and ${highDelinq.length} have delinquency above 5%.`,
    data: {
      type: 'table',
      title: 'At-Risk Merchants',
      headers: ['Merchant', 'Status', 'Volume MTD', 'Delinq %', 'FPD %', 'Trend'],
      rows: riskMerchants.map(m => {
        const vol = m.monthlyVolume;
        const trend = vol.length >= 2 ? (vol[vol.length - 1].volume > vol[0].volume ? 'Up' : 'Down') : 'N/A';
        return [m.name, m.status, fmt$(m.volumeMTD), `${m.delinquencyRate}%`, `${m.fpdRate}%`, trend];
      }),
    },
    suggestions: ['Show dormant merchants', 'Delinquency by industry', 'Collections performance'],
  };
}

function handleRepLookup(entities: Entities): ChatResponse {
  const name = entities.repNames?.[0];
  if (!name) return handleRepLeaderboard();

  const salesRep = repScorecard.find(r => r.name === name);
  const enrollRep = enrollmentReps.find(r => r.name === name);

  if (!salesRep && !enrollRep) {
    return {
      text: `I don't have anyone named "${name}" in my records. Here are the reps I know: ${ALL_REPS.map(r => r.name).join(', ')}.`,
      suggestions: ['Show top reps', 'Rep leaderboard', 'Territory comparison'],
    };
  }

  const items: { label: string; value: string; status?: 'green' | 'orange' | 'red' }[] = [];

  if (salesRep) {
    items.push(
      { label: 'Territory', value: salesRep.territory },
      { label: 'Merchants', value: salesRep.merchants.toString() },
      { label: 'Funded MTD', value: salesRep.fundedMTD.toString() },
      { label: 'Volume MTD', value: fmt$(salesRep.volumeMTD) },
      { label: 'Enrollments MTD', value: salesRep.enrollmentsMTD.toString() },
      { label: 'Activation Rate', value: `${salesRep.activationRate}%`, status: salesRep.activationRate >= 80 ? 'green' : salesRep.activationRate >= 60 ? 'orange' : 'red' },
    );
  }
  if (enrollRep && !salesRep) {
    items.push(
      { label: 'Territory', value: enrollRep.territory },
      { label: 'Enrollments MTD', value: enrollRep.enrollmentsMTD.toString() },
      { label: 'Credited MTD', value: enrollRep.creditedMTD.toString() },
      { label: 'Funded Volume', value: fmt$(enrollRep.fundedVolume) },
      { label: 'Funded Apps', value: enrollRep.fundedApps.toString() },
      { label: 'Conversion', value: `${((enrollRep.fundedApps / enrollRep.totalApps) * 100).toFixed(1)}%` },
    );
  }

  const rep = salesRep || enrollRep!;
  return {
    text: `Here's the rundown on ${name} — they're working out of ${rep.territory}.`,
    data: { type: 'kpi', items },
    suggestions: [
      `Show merchants in ${rep.territory}`,
      `How is ${rep.territory} performing?`,
      'Rep leaderboard',
    ],
  };
}

function handleRepLeaderboard(): ChatResponse {
  const sorted = [...repScorecard].sort((a, b) => b.volumeMTD - a.volumeMTD);
  return {
    text: `Here's your leaderboard! ${sorted[0].name} is out front with ${fmt$(sorted[0].volumeMTD)} in volume MTD.`,
    data: {
      type: 'table',
      title: 'Rep Leaderboard',
      headers: ['Rep', 'Territory', 'Merchants', 'Volume MTD', 'Funded MTD', 'Activation %'],
      rows: sorted.map(r => [r.name, r.territory, r.merchants, fmt$(r.volumeMTD), r.fundedMTD, `${r.activationRate}%`]),
    },
    suggestions: ['Who has the most enrollments?', 'Territory comparison', 'Top merchants by volume'],
  };
}

function handleTerritoryLookup(entities: Entities): ChatResponse {
  const code = entities.territories?.[0] || '';
  const detail = branchDetails[code];
  const perf = territoryPerformance.find(t => t.territory === code);

  if (!detail) {
    const available = Object.keys(branchDetails).join(', ');
    return {
      text: `I don't have a territory called "${code}" in the system. Here are the ones I know: ${available}.`,
      suggestions: Object.keys(branchDetails).map(t => `How is ${t} performing?`),
    };
  }

  const items: { label: string; value: string; status?: 'green' | 'orange' | 'red' }[] = [
    { label: 'Region', value: detail.region },
    { label: 'Manager', value: detail.manager },
    { label: 'Branches', value: `${detail.activeBranches} active / ${detail.branchCount} total` },
    { label: 'Enrollments', value: detail.totalEnrollments.toString() },
  ];
  if (perf) {
    items.push(
      { label: 'Pre Avg/Mo', value: fmt$(perf.preAvgMonthly) },
      { label: 'Post Run Rate', value: fmt$(perf.postRunRate) },
      { label: 'Delta', value: `${perf.deltaPct > 0 ? '+' : ''}${perf.deltaPct}%`, status: perf.deltaPct > 0 ? 'green' : 'red' },
    );
  }

  const topBranches = detail.topBranches.slice(0, 5);

  return {
    text: `Here's the scoop on ${code} — it's the ${detail.region} region, managed by ${detail.manager}. ${detail.activeBranches} of ${detail.branchCount} branches are active, with ${detail.totalEnrollments} enrollments.`,
    data: { type: 'kpi', items },
    suggestions: [
      `Show top branches in ${code}`,
      `Show reps in ${code}`,
      'Compare all territories',
    ],
  };
}

function handleTerritoryCompare(): ChatResponse {
  const sorted = [...territoryPerformance].sort((a, b) => b.deltaPct - a.deltaPct);
  return {
    text: `Here's how your territories stack up. ${sorted[0].territory} is the star with +${sorted[0].deltaPct}% growth, while ${sorted[sorted.length - 1].territory} could use some love at ${sorted[sorted.length - 1].deltaPct}%.`,
    data: {
      type: 'table',
      title: 'Territory Comparison',
      headers: ['Territory', 'Branches', 'Active', 'Pre Avg/Mo', 'Post Run Rate', 'Delta %'],
      rows: sorted.map(t => [t.territory, t.branchCount, t.activeBranches, fmt$(t.preAvgMonthly), fmt$(t.postRunRate), `${t.deltaPct > 0 ? '+' : ''}${t.deltaPct}%`]),
    },
    suggestions: sorted.slice(0, 2).map(t => `Show ${t.territory} details`).concat(['Top reps']),
  };
}

function handleKPIQuery(input: string): ChatResponse {
  const d = executiveSummary.combined;
  const o = originationsData.funding;

  if (/approval/.test(input)) {
    return {
      text: `The overall approval rate is ${o.approvalRate}%. Here's the breakdown by industry.`,
      data: {
        type: 'table',
        title: 'Approval Rate by Industry',
        headers: ['Industry', 'Approval Rate'],
        rows: approvalRateByIndustry.map(r => [r.industry, `${r.rate}%`]),
      },
      suggestions: ['Show approval funnel', 'Top merchants by approval', 'Originations overview'],
    };
  }

  if (/save rate/.test(input)) {
    return {
      text: `The current save rate is ${d.saveRate}% (target: 46%). Trend is ${d.saveRateTrend > 0 ? 'up' : 'down'} ${Math.abs(d.saveRateTrend)}% from last month.`,
      data: {
        type: 'kpi',
        items: [
          { label: 'Save Rate', value: `${d.saveRate}%`, status: d.saveRate >= 46 ? 'green' : 'orange' },
          { label: 'Trend', value: `${d.saveRateTrend > 0 ? '+' : ''}${d.saveRateTrend}%`, status: d.saveRateTrend >= 0 ? 'green' : 'red' },
          { label: 'Target', value: '46%' },
          { label: 'Finance Save', value: `${executiveSummary.finance.saveRate}%` },
        ],
      },
      suggestions: ['Collections performance', 'Save rate vs roll rate trend', 'Executive summary'],
    };
  }

  // Default: show key KPIs
  return {
    text: `Here's your KPI snapshot — the numbers that matter most right now.`,
    data: {
      type: 'kpi',
      items: [
        { label: 'Active Accounts', value: d.activeAccounts.toLocaleString() },
        { label: 'Current (0 DPD)', value: `${d.current0DPDPct}%`, status: 'green' },
        { label: 'At-Risk (31-60)', value: d.atRisk31_60.toLocaleString(), status: 'orange' },
        { label: 'Default (61+)', value: d.default61Plus.toLocaleString(), status: 'red' },
        { label: 'Save Rate', value: `${d.saveRate}%`, status: d.saveRate >= 46 ? 'green' : 'orange' },
        { label: 'Collections MTD', value: `$${d.collectionsMTD}M` },
      ],
    },
    suggestions: ['Approval rate breakdown', 'Collections detail', 'Portfolio health'],
  };
}

function handleCollectionsQuery(): ChatResponse {
  const c = collectionsData.combined;
  return {
    text: `Here's your collections pulse — contact rate is ${c.contactRate}% (target ${c.contactRateTarget}%), cure rate at ${c.cureRate}%, and save rate holding at ${c.saveRate}%.`,
    data: {
      type: 'kpi',
      items: [
        { label: 'Contact Rate', value: `${c.contactRate}%`, status: c.contactRate >= c.contactRateTarget ? 'green' : 'orange' },
        { label: 'PTP Capture', value: `${c.ptpCapture}%`, status: c.ptpCapture >= c.ptpCaptureTarget ? 'green' : 'orange' },
        { label: 'PTP Fulfill', value: `${c.ptpFulfill}%`, status: c.ptpFulfill >= c.ptpFulfillTarget ? 'green' : 'orange' },
        { label: 'Cure Rate', value: `${c.cureRate}%`, status: c.cureRate >= c.cureRateTarget ? 'green' : 'orange' },
        { label: 'Save Rate', value: `${c.saveRate}%`, status: c.saveRate >= c.saveRateTarget ? 'green' : 'orange' },
        { label: 'Payment Plans', value: `${c.paymentPlans}%` },
      ],
    },
    suggestions: ['Show DPD buckets', 'Save rate trend', 'Executive summary'],
  };
}

function handleOriginationsQuery(): ChatResponse {
  const f = originationsData.funding;
  return {
    text: `Originations are looking solid — ${f.fundedMTD.toLocaleString()} funded deals so far this month, ${fmt$(f.volumeMTD * 1_000_000)} in volume, with a ${f.approvalRate}% approval rate.`,
    data: {
      type: 'kpi',
      items: [
        { label: 'Funded MTD', value: f.fundedMTD.toLocaleString() },
        { label: 'Volume MTD', value: `$${f.volumeMTD}M` },
        { label: 'Avg Ticket', value: `$${f.avgTicket.toLocaleString()}` },
        { label: 'Approval Rate', value: `${f.approvalRate}%` },
        { label: 'AutoPay Attach', value: `${f.autoPayAttach}%`, status: 'green' },
        { label: 'Avg Funding Speed', value: f.avgFundingSpeed },
      ],
    },
    suggestions: ['Approval rate by industry', 'Top merchants by volume', 'Show the approval funnel'],
  };
}

function handleStateLookup(entities: Entities): ChatResponse {
  const stateCode = entities.states?.[0] || '';
  const stateName = STATE_NAMES[stateCode] || stateCode;
  const merchants = merchantProfiles.filter(m => m.state === stateCode);
  const enrollment = enrollmentsByState.find(e => {
    const code = STATE_CODES[e.state.toLowerCase()] || e.state;
    return code === stateCode;
  });

  const items: { label: string; value: string; status?: 'green' | 'orange' | 'red' }[] = [
    { label: 'Merchants', value: merchants.length.toString() },
    { label: 'Enrollments', value: enrollment ? enrollment.count.toString() : '0' },
  ];

  if (merchants.length > 0) {
    const totalVol = merchants.reduce((s, m) => s + m.volumeMTD, 0);
    const avgApproval = merchants.reduce((s, m) => s + m.approvalRate, 0) / merchants.length;
    items.push(
      { label: 'Total Volume MTD', value: fmt$(totalVol) },
      { label: 'Avg Approval', value: `${avgApproval.toFixed(1)}%`, status: avgApproval >= 70 ? 'green' : avgApproval >= 60 ? 'orange' : 'red' },
    );
  }

  const text = merchants.length > 0
    ? `${stateName} has ${merchants.length} merchant${merchants.length !== 1 ? 's' : ''} with ${fmt$(merchants.reduce((s, m) => s + m.volumeMTD, 0))} combined volume MTD.`
    : `${stateName} has ${enrollment?.count || 0} enrollments but no detailed merchant profiles.`;

  const response: ChatResponse = { text, data: { type: 'kpi', items }, suggestions: [] };

  if (merchants.length > 0) {
    response.data = merchantTable(merchants.sort((a, b) => b.volumeMTD - a.volumeMTD), `Merchants in ${stateName}`);
    response.suggestions = [
      `Which ${stateName} merchant has highest delinquency?`,
      'Compare all states by enrollments',
      'Show the heat map',
    ];
  } else {
    response.suggestions = ['Which states have the most merchants?', 'Show enrollments by state', 'Top merchants by volume'];
  }

  return response;
}

function handleStateEnrollment(): ChatResponse {
  const sorted = [...enrollmentsByState].sort((a, b) => b.count - a.count);
  return {
    text: `${sorted[0].state} is leading the way with ${sorted[0].count} enrollments! That's out of ${enrollmentOverview.totalEnrollments} total across ${sorted.length} states.`,
    data: {
      type: 'table',
      title: 'Enrollments by State',
      headers: ['State', 'Enrollments'],
      rows: sorted.map(s => [s.state, s.count]),
    },
    suggestions: ['Which state has most merchants?', 'Enrollment overview', 'Show the heat map'],
  };
}

function handleIndustryAnalysis(input: string, entities: Entities): ChatResponse {
  if (/delinquen/.test(input) || entities.sortBy === 'delinquency') {
    const sorted = [...delinquencyByIndustry].sort((a, b) => b.delinqRate - a.delinqRate);
    return {
      text: `Delinquency rates by industry. ${sorted[0].industry} has the highest rate at ${sorted[0].delinqRate}% with $${sorted[0].exposure}M exposure.`,
      data: {
        type: 'table',
        title: 'Delinquency by Industry',
        headers: ['Industry', 'Accounts', 'Delinq Rate', 'Exposure'],
        rows: sorted.map(r => [r.industry, r.accounts, `${r.delinqRate}%`, `$${r.exposure}M`]),
      },
      suggestions: ['Approval rate by industry', 'At-risk merchants', 'Credit risk overview'],
    };
  }

  if (/approval/.test(input)) {
    const sorted = [...approvalRateByIndustry].sort((a, b) => b.rate - a.rate);
    return {
      text: `Approval rates by industry. ${sorted[0].industry} leads at ${sorted[0].rate}%.`,
      data: {
        type: 'table',
        title: 'Approval Rate by Industry',
        headers: ['Industry', 'Approval Rate'],
        rows: sorted.map(r => [r.industry, `${r.rate}%`]),
      },
      suggestions: ['Delinquency by industry', 'Top merchants', 'Originations overview'],
    };
  }

  // Default: show both
  return {
    text: `Here's the full industry breakdown — delinquency and approval rates side by side so you can spot the patterns.`,
    data: {
      type: 'table',
      title: 'Industry Analysis',
      headers: ['Industry', 'Delinq Rate', 'Exposure', 'Approval Rate'],
      rows: delinquencyByIndustry.map(d => {
        const approval = approvalRateByIndustry.find(a => a.industry === d.industry);
        return [d.industry, `${d.delinqRate}%`, `$${d.exposure}M`, approval ? `${approval.rate}%` : '--'];
      }),
    },
    suggestions: ['Which industry has highest risk?', 'Merchants by industry', 'Credit score distribution'],
  };
}

function handlePortfolioQuery(): ChatResponse {
  const p = portfolioHealthData.combined;
  return {
    text: `Portfolio check! ${p.autoPayAccounts.toLocaleString()} accounts are on auto-pay (${(p.autoPayAccounts / (p.autoPayAccounts + p.manualPay) * 100).toFixed(1)}% of the book). Auto-pay delinquency sits at ${autoPayVsManualDelinquency[0].delinquent}% vs ${autoPayVsManualDelinquency[1].delinquent}% for manual — auto-pay continues to perform better.`,
    data: {
      type: 'kpi',
      items: [
        { label: 'Auto-Pay Accounts', value: p.autoPayAccounts.toLocaleString() },
        { label: 'AP Current', value: `${p.apCurrent}%`, status: 'green' },
        { label: 'AP Delinquent', value: `${p.apDelinquent}%`, status: p.apDelinquent < 5 ? 'green' : 'red' },
        { label: 'Manual Pay', value: p.manualPay.toLocaleString() },
        { label: 'Manual Current', value: `${autoPayVsManualDelinquency[1].current}%`, status: 'orange' },
        { label: 'Manual Delinquent', value: `${autoPayVsManualDelinquency[1].delinquent}%`, status: 'red' },
      ],
    },
    suggestions: ['Auto-pay enrollment trend', 'Portfolio aging', 'Collections performance'],
  };
}

function handleCreditRiskQuery(input: string): ChatResponse {
  if (/fpd|first payment/.test(input)) {
    return {
      text: `First Payment Default rate is ${creditRiskData.overview.fpdRate}% (${creditRiskData.overview.fpdRateTrend > 0 ? 'up' : 'down'} ${Math.abs(creditRiskData.overview.fpdRateTrend)}%). Here's the breakdown by channel.`,
      data: {
        type: 'table',
        title: 'FPD by Channel',
        headers: ['Channel', 'FPD Rate', 'Volume'],
        rows: fpdByChannel.map(r => [r.channel, `${r.fpdRate}%`, r.volume.toLocaleString()]),
      },
      suggestions: ['Credit score distribution', 'Delinquency by industry', 'At-risk merchants'],
    };
  }

  if (/score|distribution/.test(input)) {
    return {
      text: `Credit score distribution across ${creditRiskData.overview.totalFundedContracts.toLocaleString()} funded contracts. Average DR score: ${creditRiskData.overview.avgDRScore}.`,
      data: {
        type: 'table',
        title: 'Credit Score Distribution',
        headers: ['Range', 'Count', 'Default Rate'],
        rows: creditScoreDistribution.map(r => [r.range, r.count.toLocaleString(), `${r.defaultRate}%`]),
      },
      suggestions: ['FPD by channel', 'Default rate by vintage', 'Portfolio health'],
    };
  }

  const o = creditRiskData.overview;
  return {
    text: `Here's your credit & risk landscape — ${o.totalFundedContracts.toLocaleString()} funded contracts, average score of ${o.avgDRScore}, FPD rate at ${o.fpdRate}%, and 61+ day default rate at ${o.defaultRate61}%.`,
    data: {
      type: 'kpi',
      items: [
        { label: 'Funded Contracts', value: o.totalFundedContracts.toLocaleString() },
        { label: 'Avg DR Score', value: o.avgDRScore.toString() },
        { label: 'Avg APR', value: `${o.avgAPR}%` },
        { label: 'FPD Rate', value: `${o.fpdRate}%`, status: o.fpdRate < 8 ? 'green' : 'red' },
        { label: 'Default Rate (61+)', value: `${o.defaultRate61}%`, status: o.defaultRate61 < 7 ? 'green' : 'red' },
        { label: 'Portfolio Balance', value: `$${o.portfolioBalance}M` },
      ],
    },
    suggestions: ['FPD by channel', 'Credit score distribution', 'Delinquency by industry'],
  };
}

function handleExecutiveSummary(): ChatResponse {
  const d = executiveSummary.combined;
  return {
    text: `Here's the big picture — ${d.activeAccounts.toLocaleString()} active accounts, ${d.current0DPDPct}% are current, save rate is at ${d.saveRate}%, and collections have hit $${d.collectionsMTD}M (${d.collectionsMTDPct}% of target). Overall, things are moving.`,
    data: {
      type: 'kpi',
      items: [
        { label: 'Active Accounts', value: d.activeAccounts.toLocaleString() },
        { label: 'Current (0 DPD)', value: `${d.current0DPDPct}%`, status: 'green' },
        { label: 'At-Risk (31-60)', value: d.atRisk31_60.toLocaleString(), status: 'orange' },
        { label: 'Default (61+)', value: `${d.default61Plus.toLocaleString()} (${d.default61PlusPct}%)`, status: 'red' },
        { label: 'Save Rate', value: `${d.saveRate}%`, status: d.saveRate >= 46 ? 'green' : 'orange' },
        { label: 'Collections MTD', value: `$${d.collectionsMTD}M` },
      ],
    },
    suggestions: ['Collections detail', 'Originations overview', 'Top merchants by volume', 'Territory comparison'],
  };
}

function handleHelp(): ChatResponse {
  return {
    text: "Happy to help! Here's everything I can dig into for you:",
    data: {
      type: 'list',
      title: 'What I can help with',
      items: [
        'Merchant lookups — by state, status, tier, or industry',
        'Sales rep performance — individual reps or leaderboard',
        'Territory details — branches, metrics, comparisons',
        'KPIs — approval rates, save rates, collections metrics',
        'Geographic data — enrollments and merchants by state',
        'Industry analysis — delinquency and approval by sector',
        'Portfolio health — auto-pay vs manual pay stats',
        'Credit & risk — FPD rates, credit scores, defaults',
        'Executive summary — high-level dashboard overview',
      ],
    },
    suggestions: [
      'Show me merchants in Texas',
      'How is RIC-4 performing?',
      'Top reps by volume',
      'Give me a summary',
    ],
  };
}

function handleUnknown(): ChatResponse {
  return {
    text: "Hmm, I'm not quite sure what you're after there. Try asking me about merchants, reps, territories, collections, or KPIs — I'm great with those!",
    suggestions: [
      'Show me merchants in Texas',
      'How is RIC-4 performing?',
      'What are the top merchants by volume?',
      'How are collections doing?',
      'Give me a summary',
    ],
  };
}

// ── Main Engine ──
export const processQuery: QueryEngine = async (query: string): Promise<ChatResponse> => {
  // Simulate realistic response delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));

  const normalized = query.toLowerCase().trim();
  const entities = extractEntities(normalized);
  const intent = detectIntent(normalized, entities);

  switch (intent) {
    case 'MERCHANT_LOOKUP': return handleMerchantLookup(entities);
    case 'MERCHANT_TOP': return handleMerchantTop(entities);
    case 'MERCHANT_RISK': return handleMerchantRisk(entities);
    case 'REP_LOOKUP': return handleRepLookup(entities);
    case 'REP_LEADERBOARD': return handleRepLeaderboard();
    case 'TERRITORY_LOOKUP': return handleTerritoryLookup(entities);
    case 'TERRITORY_COMPARE': return handleTerritoryCompare();
    case 'KPI_QUERY': return handleKPIQuery(normalized);
    case 'COLLECTIONS_QUERY': return handleCollectionsQuery();
    case 'ORIGINATIONS_QUERY': return handleOriginationsQuery();
    case 'STATE_LOOKUP': return handleStateLookup(entities);
    case 'STATE_ENROLLMENT': return handleStateEnrollment();
    case 'INDUSTRY_ANALYSIS': return handleIndustryAnalysis(normalized, entities);
    case 'PORTFOLIO_QUERY': return handlePortfolioQuery();
    case 'CREDIT_RISK_QUERY': return handleCreditRiskQuery(normalized);
    case 'EXECUTIVE_SUMMARY': return handleExecutiveSummary();
    case 'HELP': return handleHelp();
    default: return handleUnknown();
  }
};
