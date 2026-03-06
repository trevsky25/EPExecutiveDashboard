// 6-month trend data for each KPI (used by mini charts on My Dashboard)
// Values are approximate monthly snapshots derived from existing mock data.

export const kpiTrendData: Record<string, number[]> = {
  // ── Executive Summary ──
  'exec-active-accounts': [44200, 44800, 45600, 46100, 46800, 47234],
  'exec-save-rate': [52, 50, 48, 47, 46, 45],
  'exec-collections-mtd': [1.4, 1.5, 1.6, 1.7, 1.7, 1.8],
  'exec-at-risk': [2400, 2520, 2580, 2650, 2740, 2847],
  'exec-current-0dpd': [36200, 36800, 37100, 37600, 38100, 38542],

  // ── Collections ──
  'coll-contact-rate': [58, 59, 57, 60, 58, 59],
  'coll-ptp-capture': [38, 39, 37, 40, 41, 42],
  'coll-cure-rate': [22, 23, 21, 24, 22, 23],

  // ── Customer Care ──
  'cc-blended-cph': [10.2, 10.5, 10.8, 11.0, 11.2, 11.4],
  'cc-first-call-res': [68, 69, 70, 71, 72, 73],
  'cc-service-level': [76, 77, 75, 78, 77, 78],
  'cc-csat': [4.1, 4.0, 4.2, 4.1, 4.3, 4.2],

  // ── Originations ──
  'orig-funded-mtd': [1180, 1220, 1260, 1310, 1350, 1394],
  'orig-approval-rate': [64, 65, 63, 66, 65, 67],
  'orig-volume-mtd': [8.2, 8.6, 9.0, 9.4, 9.8, 10.2],
  'orig-avg-ticket': [6800, 6900, 7000, 7100, 7200, 7340],
  'orig-autopay-attach': [62, 63, 64, 65, 66, 68],

  // ── Portfolio Health ──
  'ph-autopay-pct': [52, 53, 54, 55, 56, 57],
  'ph-ap-current': [90, 91, 91, 92, 92, 93],

  // ── Credit & Risk ──
  'cr-avg-dr-score': [680, 682, 684, 685, 686, 688],
  'cr-fpd-rate': [5.2, 5.0, 4.8, 5.1, 4.9, 4.7],
  'cr-default-rate': [3.8, 3.6, 3.5, 3.4, 3.3, 3.2],
  'cr-portfolio-balance': [82, 84, 86, 88, 90, 92],

  // ── Sales ──
  'sales-active-merchants': [2100, 2150, 2200, 2240, 2280, 2340],
  'sales-new-enrollments': [38, 42, 45, 48, 51, 54],
  'sales-funded-volume': [3.8, 4.0, 4.2, 4.4, 4.6, 4.8],
  'sales-dormant-merchants': [320, 310, 305, 298, 290, 284],

  // ── Merchant Services ──
  'ms-active-partners': [1080, 1100, 1120, 1140, 1160, 1184],
  'ms-partner-satisfaction': [4.0, 4.1, 4.0, 4.2, 4.1, 4.2],
  'ms-support-tickets': [42, 38, 45, 40, 36, 34],
  'ms-churn-rate': [2.8, 2.6, 2.5, 2.4, 2.3, 2.1],

  // ── MyEasyPay Mobile ──
  'mobile-total-downloads': [148000, 156000, 164000, 172000, 178000, 184200],
  'mobile-dau': [23000, 24000, 25100, 26200, 27300, 28400],
  'mobile-retention': [62, 63, 65, 66, 67, 68],
  'mobile-avg-rating': [4.3, 4.4, 4.4, 4.5, 4.5, 4.6],

  // ── Website Traffic ──
  'web-sessions': [98200, 104600, 112400, 108200, 118600, 126400],
  'web-unique-visitors': [65400, 70100, 74800, 72400, 79200, 84200],
  'web-bounce-rate': [42.1, 41.2, 40.6, 39.8, 39.2, 38.4],
  'web-conversion-rate': [2.4, 2.6, 2.8, 2.9, 3.0, 3.2],

  // ── Outbound Marketing ──
  'mktg-open-rate': [30.2, 31.4, 32.8, 33.6, 33.8, 34.2],
  'mktg-click-rate': [3.8, 4.0, 4.2, 4.5, 4.6, 4.8],
  'mktg-list-size': [38200, 39400, 40500, 41400, 42100, 42800],
  'mktg-revenue': [210, 228, 242, 258, 270, 284],
};
