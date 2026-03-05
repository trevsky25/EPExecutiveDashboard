export type Annotation = {
  id: string;
  chartId: string;
  dataKey: string;     // matches the 'month' field in chart data
  label: string;
  description: string;
  type: 'policy' | 'campaign' | 'outage' | 'milestone';
};

export const chartAnnotations: Record<string, Annotation[]> = {
  'save-rate-trend': [
    { id: 'a1', chartId: 'save-rate-trend', dataKey: 'Oct', label: 'Collection Strategy Update', description: 'Shifted from 3-call to 5-call sequence for 31-60 DPD bucket.', type: 'policy' },
    { id: 'a2', chartId: 'save-rate-trend', dataKey: 'Dec', label: 'Holiday Staffing Reduction', description: 'Collections team reduced to 60% capacity Dec 20-Jan 3.', type: 'milestone' },
  ],
  'monthly-funding-trend': [
    { id: 'a3', chartId: 'monthly-funding-trend', dataKey: 'Nov', label: 'Black Friday Campaign', description: '0% APR promotional campaign drove 12% volume spike.', type: 'campaign' },
  ],
  'save-vs-roll': [
    { id: 'a4', chartId: 'save-vs-roll', dataKey: 'Sep', label: 'Dialer System Outage', description: '4-hour outage impacted 2,400 scheduled calls.', type: 'outage' },
  ],
};
