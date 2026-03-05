/**
 * Insight Engine — Analyzes mock data per tab and generates plain-English insights.
 */

import {
  executiveSummary, collectionsData, customerCareData, originationsData,
  portfolioHealthData, creditRiskData, salesData, saveRateTrend, saveVsRollTrend,
} from '@/data/mockData';

export type InsightSeverity = 'positive' | 'info' | 'warning' | 'critical';
export type InsightIcon = 'TrendingUp' | 'TrendingDown' | 'AlertTriangle' | 'CheckCircle' | 'Info' | 'Target';

export type Insight = {
  id: string;
  icon: InsightIcon;
  severity: InsightSeverity;
  text: string;
};

export function generateInsights(tab: string): Insight[] {
  switch (tab) {
    case 'executive-summary': return execInsights();
    case 'collections': return collectionsInsights();
    case 'customer-care': return customerCareInsights();
    case 'originations': return originationsInsights();
    case 'portfolio-health': return portfolioHealthInsights();
    case 'credit-risk': return creditRiskInsights();
    case 'sales': return salesInsights();
    case 'merchant-services': return merchantServicesInsights();
    default: return [];
  }
}

function execInsights(): Insight[] {
  const d = executiveSummary;
  const insights: Insight[] = [];

  if (d.combined.saveRate < 46) {
    insights.push({
      id: 'exec-save-below',
      icon: 'AlertTriangle',
      severity: 'warning',
      text: `Save rate at ${d.combined.saveRate}% is ${(46 - d.combined.saveRate).toFixed(1)}pts below the 46% target. LTO portfolio driving the gap at ${d.lto.saveRate}%.`,
    });
  }

  if (d.combined.atRisk31_60Trend > 5) {
    insights.push({
      id: 'exec-atrisk-surge',
      icon: 'TrendingUp',
      severity: 'critical',
      text: `At-risk accounts (31-60 DPD) surged ${d.combined.atRisk31_60Trend}% MoM — $${d.combined.atRisk31_60Exposure}M exposure requires attention.`,
    });
  }

  if (d.finance.fundedMTDTrend > 10) {
    insights.push({
      id: 'exec-finance-growth',
      icon: 'CheckCircle',
      severity: 'positive',
      text: `Finance funded volume up ${d.finance.fundedMTDTrend}% MoM (${d.finance.fundedMTD} deals). Strong origination momentum.`,
    });
  }

  if (d.combined.collectionsMTDPct < 100 && d.combined.collectionsMTDPct >= 90) {
    insights.push({
      id: 'exec-collections-close',
      icon: 'Target',
      severity: 'info',
      text: `Collections at ${d.combined.collectionsMTDPct}% of target ($${d.combined.collectionsMTD}M). On pace to meet goal by month-end.`,
    });
  }

  return insights;
}

function collectionsInsights(): Insight[] {
  const d = collectionsData.combined;
  const insights: Insight[] = [];

  const contactGap = d.contactRateTarget - d.contactRate;
  if (contactGap > 3) {
    insights.push({
      id: 'coll-contact-gap',
      icon: 'AlertTriangle',
      severity: 'warning',
      text: `Contact rate at ${d.contactRate}% is ${contactGap.toFixed(1)}pts below the ${d.contactRateTarget}% target. Consider increasing dialer capacity.`,
    });
  }

  // Save vs Roll trend
  const latest = saveVsRollTrend[saveVsRollTrend.length - 1];
  const prev = saveVsRollTrend[saveVsRollTrend.length - 2];
  if (latest && prev && latest.rollRate > prev.rollRate) {
    insights.push({
      id: 'coll-roll-rising',
      icon: 'TrendingUp',
      severity: 'critical',
      text: `Roll rate increased from ${prev.rollRate}% to ${latest.rollRate}% — accounts are flowing to later DPD buckets faster.`,
    });
  }

  if (d.cureRate < d.cureRateTarget) {
    insights.push({
      id: 'coll-cure-below',
      icon: 'TrendingDown',
      severity: 'warning',
      text: `Cure rate at ${d.cureRate}% vs ${d.cureRateTarget}% target. ${(d.cureRateTarget - d.cureRate).toFixed(1)}pt gap to close.`,
    });
  }

  if (d.ptpFulfill < d.ptpFulfillTarget) {
    insights.push({
      id: 'coll-ptp-fulfill',
      icon: 'Info',
      severity: 'info',
      text: `PTP fulfillment at ${d.ptpFulfill}% — ${(d.ptpFulfillTarget - d.ptpFulfill).toFixed(1)}pts below target. Follow-up cadence may need tightening.`,
    });
  }

  return insights;
}

function customerCareInsights(): Insight[] {
  const d = customerCareData.combined;
  const insights: Insight[] = [];

  if (d.serviceLevel < d.serviceLevelTarget) {
    insights.push({
      id: 'cc-sl-below',
      icon: 'AlertTriangle',
      severity: 'warning',
      text: `Service level at ${d.serviceLevel}% — ${(d.serviceLevelTarget - d.serviceLevel).toFixed(1)}pts below the ${d.serviceLevelTarget}% target. Call volume may be outpacing staffing.`,
    });
  }

  if (d.firstCallResTrend > 0) {
    insights.push({
      id: 'cc-fcr-improving',
      icon: 'CheckCircle',
      severity: 'positive',
      text: `First call resolution improved +${d.firstCallResTrend}% to ${d.firstCallRes}%. Fewer repeat contacts expected.`,
    });
  }

  insights.push({
    id: 'cc-csat',
    icon: d.csat >= 4.0 ? 'CheckCircle' : 'AlertTriangle',
    severity: d.csat >= 4.0 ? 'positive' : 'warning',
    text: `CSAT at ${d.csat}/${d.csatMax} — ${d.csat >= 4.0 ? 'above threshold. Maintain quality focus.' : 'trending below comfort zone.'}`,
  });

  return insights;
}

function originationsInsights(): Insight[] {
  const d = originationsData.funding;
  const insights: Insight[] = [];

  if (d.fundedMTDTrend > 10) {
    insights.push({
      id: 'orig-funded-strong',
      icon: 'CheckCircle',
      severity: 'positive',
      text: `Funded volume up ${d.fundedMTDTrend}% MoM (${d.fundedMTD} deals, $${d.volumeMTD}M). Strong pipeline conversion.`,
    });
  }

  if (d.approvalRate < 65) {
    insights.push({
      id: 'orig-approval-watch',
      icon: 'Info',
      severity: 'info',
      text: `Approval rate at ${d.approvalRate}% — ${d.approvalRateTrend > 0 ? 'trending up' : 'flat'}. Credit box may be tightening.`,
    });
  }

  if (d.autoPayAttach < 75) {
    insights.push({
      id: 'orig-autopay-gap',
      icon: 'AlertTriangle',
      severity: 'warning',
      text: `AutoPay attach rate at ${d.autoPayAttach}% — below 75% goal. Push merchant enrollment at point of sale.`,
    });
  }

  if (d.sameDayPct > 60) {
    insights.push({
      id: 'orig-speed',
      icon: 'CheckCircle',
      severity: 'positive',
      text: `${d.sameDayPct}% of apps funded same-day. Avg speed: ${d.avgFundingSpeed}. Merchant experience is strong.`,
    });
  }

  return insights;
}

function portfolioHealthInsights(): Insight[] {
  const d = portfolioHealthData.combined;
  const insights: Insight[] = [];

  if (d.autoPayPct > 65) {
    insights.push({
      id: 'ph-autopay-strong',
      icon: 'CheckCircle',
      severity: 'positive',
      text: `AutoPay adoption at ${d.autoPayPct}% (${d.autoPayAccounts.toLocaleString()} accounts). Strong delinquency buffer.`,
    });
  }

  if (d.apDelinquentPct > 3) {
    insights.push({
      id: 'ph-ap-delinq',
      icon: 'AlertTriangle',
      severity: 'warning',
      text: `Even AutoPay accounts show ${d.apDelinquentPct}% delinquency (${d.apDelinquent.toLocaleString()} accounts). Monitor payment failures.`,
    });
  }

  const manualRisk = 100 - d.autoPayPct;
  insights.push({
    id: 'ph-manual-risk',
    icon: 'Info',
    severity: manualRisk > 35 ? 'warning' : 'info',
    text: `${d.manualPayPct}% of portfolio on manual pay (${d.manualPay.toLocaleString()} accounts) — higher delinquency risk segment.`,
  });

  return insights;
}

function creditRiskInsights(): Insight[] {
  const insights: Insight[] = [];

  const d = creditRiskData;
  if (d.overview.fpdRate > 7) {
    insights.push({
      id: 'cr-fpd-high',
      icon: 'AlertTriangle',
      severity: 'critical',
      text: `First Payment Default rate at ${d.overview.fpdRate}% — above 7% threshold. Review underwriting criteria for recent vintages.`,
    });
  }

  if (d.overview.defaultRate61 > 3) {
    insights.push({
      id: 'cr-default-high',
      icon: 'TrendingUp',
      severity: 'warning',
      text: `61+ day default rate at ${d.overview.defaultRate61}%. $${executiveSummary.combined.default61PlusExposure}M exposure.`,
    });
  }

  insights.push({
    id: 'cr-score-distribution',
    icon: 'Info',
    severity: 'info',
    text: `Portfolio credit quality: ${d.overview.avgDRScore} avg DR score. ${d.overview.avgAPR}% avg APR across ${d.overview.totalFundedContracts.toLocaleString()} contracts.`,
  });

  return insights;
}

function salesInsights(): Insight[] {
  const d = salesData.overview;
  const insights: Insight[] = [];

  insights.push({
    id: 'sales-merchants',
    icon: d.newEnrollmentsTrend > 0 ? 'CheckCircle' : 'TrendingDown',
    severity: d.newEnrollmentsTrend > 0 ? 'positive' : 'warning',
    text: `Active merchants at ${d.totalActiveMerchants.toLocaleString()} with ${d.newEnrollmentsMTD} new enrollments (+${d.newEnrollmentsTrend}%) this month.`,
  });

  if (d.avgDaysToFirstFunding > 15) {
    insights.push({
      id: 'sales-slow-activation',
      icon: 'AlertTriangle',
      severity: 'warning',
      text: `Avg days-to-first-funding: ${d.avgDaysToFirstFunding}d. Target is <10d — activation is lagging.`,
    });
  }

  const dormantPct = ((d.dormantMerchants30 / d.totalActiveMerchants) * 100);
  if (dormantPct > 10) {
    insights.push({
      id: 'sales-dormant',
      icon: 'Info',
      severity: 'info',
      text: `${dormantPct.toFixed(1)}% merchant dormancy (30d). ${d.dormantMerchants30} inactive partners need re-engagement.`,
    });
  }

  return insights;
}

function merchantServicesInsights(): Insight[] {
  const d = originationsData.merchantServices;
  const t = originationsData.merchantTeam;
  const insights: Insight[] = [];

  if (d.newOnboardedTrend > 10) {
    insights.push({
      id: 'ms-onboard-strong',
      icon: 'CheckCircle',
      severity: 'positive',
      text: `${d.newOnboardedMTD} merchants onboarded this month (+${d.newOnboardedTrend}%). Pipeline is healthy.`,
    });
  }

  if (d.merchantChurn > 2) {
    insights.push({
      id: 'ms-churn-watch',
      icon: 'AlertTriangle',
      severity: 'warning',
      text: `Merchant churn at ${d.merchantChurn}% — up ${d.merchantChurnTrend}pts. Review attrition drivers by vertical.`,
    });
  }

  if (d.activationRate > 80) {
    insights.push({
      id: 'ms-activation',
      icon: 'CheckCircle',
      severity: 'positive',
      text: `${d.activationRate}% activation rate — strong merchant onboarding process. CSAT at ${d.merchantCSAT}/5.`,
    });
  }

  insights.push({
    id: 'ms-team-throughput',
    icon: 'Info',
    severity: 'info',
    text: `Team processing ${t.appsProcessed.toLocaleString()} apps MTD (+${t.appsProcessedTrend}%). Avg response time: ${t.avgResponseTime}.`,
  });

  return insights;
}
