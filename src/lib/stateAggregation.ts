import type { MerchantProfile } from '@/data/mockData';

export type StateAggregation = {
  stateCode: string;
  stateName: string;
  merchantCount: number;
  totalVolumeMTD: number;
  totalDealsMTD: number;
  avgApprovalRate: number;
  enrollmentCount: number;
  merchants: MerchantProfile[];
  territories: string[];
};

export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
  CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
  IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas',
  KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
  VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
  WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia',
};

const STATE_CODES: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAMES).map(([code, name]) => [name, code])
);

export function aggregateByState(
  merchants: MerchantProfile[],
  enrollments: { state: string; count: number }[]
): Map<string, StateAggregation> {
  const map = new Map<string, StateAggregation>();

  for (const m of merchants) {
    const code = m.state;
    if (!map.has(code)) {
      map.set(code, {
        stateCode: code,
        stateName: STATE_NAMES[code] || code,
        merchantCount: 0,
        totalVolumeMTD: 0,
        totalDealsMTD: 0,
        avgApprovalRate: 0,
        enrollmentCount: 0,
        merchants: [],
        territories: [],
      });
    }
    const agg = map.get(code)!;
    agg.merchantCount++;
    agg.totalVolumeMTD += m.volumeMTD;
    agg.totalDealsMTD += m.dealsMTD;
    agg.merchants.push(m);
    if (!agg.territories.includes(m.territory)) {
      agg.territories.push(m.territory);
    }
  }

  for (const agg of map.values()) {
    const rates = agg.merchants.filter(m => m.approvalRate > 0);
    agg.avgApprovalRate = rates.length > 0
      ? rates.reduce((s, m) => s + m.approvalRate, 0) / rates.length
      : 0;
  }

  for (const e of enrollments) {
    const code = STATE_CODES[e.state] || e.state;
    if (map.has(code)) {
      map.get(code)!.enrollmentCount = e.count;
    } else {
      map.set(code, {
        stateCode: code,
        stateName: e.state,
        merchantCount: 0,
        totalVolumeMTD: 0,
        totalDealsMTD: 0,
        avgApprovalRate: 0,
        enrollmentCount: e.count,
        merchants: [],
        territories: [],
      });
    }
  }

  return map;
}
