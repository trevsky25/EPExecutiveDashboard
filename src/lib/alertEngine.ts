/**
 * Alert Engine — Checks metric thresholds against mock data and generates alerts.
 */

import {
  executiveSummary, collectionsData, customerCareData, originationsData,
  creditRiskData, salesData,
} from '@/data/mockData';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export type Alert = {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  metric: string;
  currentValue: number;
  threshold: number;
  tab: string;
  timestamp: number;
  read: boolean;
};

type ThresholdDef = {
  id: string;
  metric: string;
  tab: string;
  condition: 'below' | 'above';
  threshold: number;
  getValue: () => number;
  severity: AlertSeverity;
  messageTemplate: (current: number, threshold: number) => string;
};

const thresholds: ThresholdDef[] = [
  {
    id: 'save-rate-below',
    metric: 'Save Rate',
    tab: 'collections',
    condition: 'below',
    threshold: 46,
    getValue: () => collectionsData.combined.saveRate,
    severity: 'warning',
    messageTemplate: (c, t) => `Save rate at ${c}% is ${(t - c).toFixed(1)}pts below the ${t}% target.`,
  },
  {
    id: 'contact-rate-below',
    metric: 'Contact Rate',
    tab: 'collections',
    condition: 'below',
    threshold: 75,
    getValue: () => collectionsData.combined.contactRate,
    severity: 'warning',
    messageTemplate: (c, t) => `Contact rate at ${c}% — ${(t - c).toFixed(1)}pts below the ${t}% target.`,
  },
  {
    id: 'fpd-rate-high',
    metric: 'FPD Rate',
    tab: 'credit-risk',
    condition: 'above',
    threshold: 7,
    getValue: () => creditRiskData.overview.fpdRate,
    severity: 'critical',
    messageTemplate: (c, t) => `First payment default rate at ${c}% exceeds ${t}% threshold.`,
  },
  {
    id: 'at-risk-surge',
    metric: 'At-Risk (31-60) Trend',
    tab: 'executive-summary',
    condition: 'above',
    threshold: 5,
    getValue: () => executiveSummary.combined.atRisk31_60Trend,
    severity: 'critical',
    messageTemplate: (c) => `At-risk accounts (31-60 DPD) surged ${c}% MoM — requires attention.`,
  },
  {
    id: 'service-level-below',
    metric: 'Service Level',
    tab: 'customer-care',
    condition: 'below',
    threshold: 85,
    getValue: () => customerCareData.combined.serviceLevel,
    severity: 'warning',
    messageTemplate: (c, t) => `Service level at ${c}% — below ${t}% SLA target.`,
  },
  {
    id: 'autopay-attach-below',
    metric: 'AutoPay Attach',
    tab: 'originations',
    condition: 'below',
    threshold: 75,
    getValue: () => originationsData.funding.autoPayAttach,
    severity: 'info',
    messageTemplate: (c, t) => `AutoPay attach rate at ${c}% — below ${t}% goal.`,
  },
  {
    id: 'cure-rate-below',
    metric: 'Cure Rate',
    tab: 'collections',
    condition: 'below',
    threshold: 60,
    getValue: () => collectionsData.combined.cureRate,
    severity: 'warning',
    messageTemplate: (c, t) => `Cure rate at ${c}% — ${(t - c).toFixed(1)}pts below ${t}% target.`,
  },
  {
    id: 'lto-save-rate-drop',
    metric: 'LTO Save Rate',
    tab: 'executive-summary',
    condition: 'below',
    threshold: 42,
    getValue: () => executiveSummary.lto.saveRate,
    severity: 'critical',
    messageTemplate: (c, t) => `LTO save rate at ${c}% — critically below ${t}% floor.`,
  },
  {
    id: 'default-rate-high',
    metric: 'Default Rate (61+)',
    tab: 'credit-risk',
    condition: 'above',
    threshold: 5,
    getValue: () => creditRiskData.overview.defaultRate61,
    severity: 'warning',
    messageTemplate: (c, t) => `61+ day default rate at ${c}% — above ${t}% watch threshold.`,
  },
  {
    id: 'merchant-churn-high',
    metric: 'Merchant Churn',
    tab: 'merchant-services',
    condition: 'above',
    threshold: 2,
    getValue: () => originationsData.merchantServices.merchantChurn,
    severity: 'info',
    messageTemplate: (c, t) => `Merchant churn at ${c}% — above ${t}% comfort level.`,
  },
];

export type NotificationPreference = {
  id: string;
  enabled: boolean;
};

export type ThresholdMeta = {
  id: string;
  metric: string;
  tab: string;
  severity: AlertSeverity;
  condition: 'below' | 'above';
  threshold: number;
};

export function getThresholdMetas(): ThresholdMeta[] {
  return thresholds.map(t => ({
    id: t.id, metric: t.metric, tab: t.tab,
    severity: t.severity, condition: t.condition, threshold: t.threshold,
  }));
}

export function checkAlertsWithPrefs(prefs: NotificationPreference[]): Alert[] {
  const prefMap = new Map(prefs.map(p => [p.id, p]));
  const now = Date.now();
  const alerts: Alert[] = [];

  for (const def of thresholds) {
    const pref = prefMap.get(def.id);
    if (pref && !pref.enabled) continue;

    const current = def.getValue();
    const triggered = def.condition === 'below' ? current < def.threshold : current > def.threshold;

    if (triggered) {
      alerts.push({
        id: def.id, severity: def.severity, title: def.metric,
        message: def.messageTemplate(current, def.threshold),
        metric: def.metric, currentValue: current, threshold: def.threshold,
        tab: def.tab, timestamp: now - Math.floor(Math.random() * 3600000), read: false,
      });
    }
  }

  const order: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => order[a.severity] - order[b.severity]);
  return alerts;
}

export function checkAlerts(): Alert[] {
  const now = Date.now();
  const alerts: Alert[] = [];

  for (const def of thresholds) {
    const current = def.getValue();
    const triggered =
      def.condition === 'below' ? current < def.threshold : current > def.threshold;

    if (triggered) {
      alerts.push({
        id: def.id,
        severity: def.severity,
        title: def.metric,
        message: def.messageTemplate(current, def.threshold),
        metric: def.metric,
        currentValue: current,
        threshold: def.threshold,
        tab: def.tab,
        // Stagger timestamps for visual variety
        timestamp: now - Math.floor(Math.random() * 3600000),
        read: false,
      });
    }
  }

  // Sort: critical first, then warning, then info
  const order: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => order[a.severity] - order[b.severity]);

  return alerts;
}
