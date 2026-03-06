// =============================================================================
// EasyPay Executive Dashboard — Mock Data Service
// Structured to mirror EAC field definitions from requirements tracker
// Replace with real API calls when EAC integration is ready
// =============================================================================

// --- Executive Summary ---
export const executiveSummary = {
  combined: {
    activeAccounts: 47234,
    activeAccountsTrend: 3.2,
    current0DPD: 38542,
    current0DPDPct: 81.6,
    atRisk31_60: 2847,
    atRisk31_60Trend: 8.3,
    atRisk31_60Exposure: 4.2,
    default61Plus: 1496,
    default61PlusPct: 3.2,
    default61PlusExposure: 2.8,
    saveRate: 45.0,
    saveRateTrend: -1,
    collectionsMTD: 1.8,
    collectionsMTDPct: 92,
  },
  finance: {
    active: 28412,
    activePct: 60.2,
    saveRate: 48.2,
    saveRateTrend: -3.1,
    fundedMTD: 1098,
    fundedMTDTrend: 14.1,
    cph: 28.5,
    cphStatus: 'On target',
  },
  lto: {
    active: 18822,
    activePct: 39.8,
    saveRate: 40.1,
    saveRateTrend: -7.8,
    fundedMTD: 749,
    fundedMTDTrend: 9.6,
    cph: 16.2,
    cphStatus: '-43% gap',
  },
};

// --- Save Rate Trend Data ---
export const saveRateTrend = [
  { month: 'Aug', financeSave: 68, ltoSave: 55, target: 50 },
  { month: 'Sep', financeSave: 65, ltoSave: 52, target: 50 },
  { month: 'Oct', financeSave: 60, ltoSave: 48, target: 50 },
  { month: 'Nov', financeSave: 55, ltoSave: 42, target: 50 },
  { month: 'Dec', financeSave: 50, ltoSave: 38, target: 50 },
  { month: 'Jan', financeSave: 48, ltoSave: 40, target: 50 },
];

// --- Monthly Funding Trend ---
export const monthlyFundingTrend = [
  { month: 'Aug', finance: 950, lto: 620 },
  { month: 'Sep', finance: 1020, lto: 680 },
  { month: 'Oct', finance: 980, lto: 710 },
  { month: 'Nov', finance: 1050, lto: 690 },
  { month: 'Dec', finance: 1100, lto: 720 },
  { month: 'Jan', finance: 1098, lto: 749 },
];

// --- Delinquency Waterfall ---
export const delinquencyWaterfall = [
  { bucket: 'Current', count: 38542, color: '#10b981' },
  { bucket: '1-15', count: 2891, color: '#14b8a6' },
  { bucket: '16-30', count: 1458, color: '#f97316' },
  { bucket: '31-60', count: 2847, color: '#f59e0b' },
  { bucket: '61+', count: 1496, color: '#ef4444' },
];

// --- Collections Channel Mix ---
export const channelMix = [
  { name: 'Auto-Pay', value: 45, color: '#10b981' },
  { name: 'Self-Service', value: 22, color: '#8b5cf6' },
  { name: 'Agent', value: 25, color: '#14b8a6' },
  { name: 'Plans', value: 8, color: '#a78bfa' },
];

// --- Collections Tab ---
export const collectionsData = {
  combined: {
    contactRate: 68.2,
    contactRateTarget: 75,
    ptpCapture: 42.8,
    ptpCaptureTarget: 50,
    ptpFulfill: 61.4,
    ptpFulfillTarget: 70,
    paymentPlans: 35.7,
    paymentPlansTarget: 40,
    cureRate: 52.3,
    cureRateTarget: 60,
    saveRate: 45.0,
    saveRateTarget: 46,
  },
  dpdBuckets: [
    { bucket: 'Current', accounts: 38542, pctPortfolio: 81.6, exposure: 58.3, mom: 1.2, momDir: 'up' as const, status: 'Healthy' as const },
    { bucket: '1-15 DPD', accounts: 2891, pctPortfolio: 6.1, exposure: 3.8, mom: 0.3, momDir: 'flat' as const, status: 'Stable' as const },
    { bucket: '16-30 DPD', accounts: 1458, pctPortfolio: 3.1, exposure: 2.1, mom: 1.3, momDir: 'up' as const, status: 'Watch' as const },
    { bucket: '31-60 DPD', accounts: 2847, pctPortfolio: 6.0, exposure: 4.2, mom: 8.3, momDir: 'up' as const, status: 'Critical' as const },
    { bucket: '61+ DPD', accounts: 1496, pctPortfolio: 3.2, exposure: 2.8, mom: 3.2, momDir: 'up' as const, status: 'Critical' as const },
  ],
};

export const saveVsRollTrend = [
  { month: 'Aug', saveRate: 70, rollRate: 12 },
  { month: 'Sep', saveRate: 65, rollRate: 14 },
  { month: 'Oct', saveRate: 60, rollRate: 16 },
  { month: 'Nov', saveRate: 55, rollRate: 18 },
  { month: 'Dec', saveRate: 48, rollRate: 22 },
  { month: 'Jan', saveRate: 45, rollRate: 25 },
];

export const recoveryPerformance = [
  { month: 'Aug', recoveryPct: 14.2, amount: 142000 },
  { month: 'Sep', recoveryPct: 13.8, amount: 155000 },
  { month: 'Oct', recoveryPct: 15.1, amount: 148000 },
  { month: 'Nov', recoveryPct: 14.5, amount: 162000 },
  { month: 'Dec', recoveryPct: 13.2, amount: 158000 },
  { month: 'Jan', recoveryPct: 14.8, amount: 170000 },
];

// --- Customer Care Tab ---
export const customerCareData = {
  combined: {
    totalHeadcount: 75,
    blendedCPH: 22.8,
    cphDetail: 'Fin 28.5 / LTO 16.2',
    avgHandleTime: '4:32',
    avgHandleTimeTarget: '4:00',
    firstCallRes: 78.4,
    firstCallResTrend: 1.8,
    serviceLevel: 82.1,
    serviceLevelTarget: 85,
    csat: 4.1,
    csatMax: 5.0,
  },
};

export const cphByTeam = [
  { team: 'Finance CS', cph: 28.5, target: 28 },
  { team: 'LTO CS', cph: 16.2, target: 25 },
  { team: 'Collections', cph: 22.4, target: 22 },
  { team: 'Merchant Svc', cph: 22.4, target: 20 },
];

export const callVolumeServiceLevel = [
  { month: 'Aug', volume: 42000, serviceLevel: 85 },
  { month: 'Sep', volume: 44000, serviceLevel: 83 },
  { month: 'Oct', volume: 46000, serviceLevel: 81 },
  { month: 'Nov', volume: 45000, serviceLevel: 84 },
  { month: 'Dec', volume: 48000, serviceLevel: 80 },
  { month: 'Jan', volume: 47000, serviceLevel: 82 },
];

// --- Originations Tab ---
export const originationsData = {
  funding: {
    fundedMTD: 1847,
    fundedMTDTrend: 12.3,
    volumeMTD: 2.8,
    volumeMTDTrend: 7.7,
    avgTicket: 1516,
    avgTicketTrend: 0,
    approvalRate: 62.4,
    approvalRateTrend: 1.2,
    autoPayAttach: 74.2,
    autoPayAttachTrend: 3.1,
    avgFundingSpeed: '1.2d',
    sameDayPct: 68,
  },
  merchantServices: {
    activeMerchants: 5124,
    activeMerchantsTrend: 2.8,
    newOnboardedMTD: 47,
    newOnboardedTrend: 18,
    activationRate: 84.3,
    activationRateTrend: 3.2,
    avgVolPerMerchant: 546,
    merchantChurn: 2.1,
    merchantChurnTrend: 0.3,
    merchantCSAT: 4.5,
    agents: 8,
    totalPartners: '5,000+',
  },
  merchantTeam: {
    callsMTD: 3842,
    callsMTDTrend: 6.1,
    cph: 22.4,
    cphStatus: 'On target',
    contactsPerMerchant: 3.2,
    avgResponseTime: '12m',
    avgResponseTimeTarget: '15m',
    appsProcessed: 4820,
    appsProcessedTrend: 8.4,
  },
};

export const fundingTrend = [
  { month: 'Aug', finance: 950, lto: 500 },
  { month: 'Sep', finance: 1000, lto: 580 },
  { month: 'Oct', finance: 1020, lto: 600 },
  { month: 'Nov', finance: 1080, lto: 650 },
  { month: 'Dec', finance: 1100, lto: 700 },
  { month: 'Jan', finance: 1098, lto: 749 },
];

export const approvalFunnel = [
  { stage: 'Apps', count: 4820, color: '#94a3b8' },
  { stage: 'Pre-Qual', count: 3500, color: '#14b8a6' },
  { stage: 'Approved', count: 3010, color: '#10b981' },
  { stage: 'Funded', count: 1847, color: '#059669' },
];

export const merchantOnboardingTrend = [
  { month: 'Aug', newMerchants: 38, activated: 32 },
  { month: 'Sep', newMerchants: 42, activated: 36 },
  { month: 'Oct', newMerchants: 45, activated: 38 },
  { month: 'Nov', newMerchants: 40, activated: 35 },
  { month: 'Dec', newMerchants: 52, activated: 44 },
  { month: 'Jan', newMerchants: 47, activated: 40 },
];

export const merchantVerticalMix = [
  { name: 'Auto', value: 28, color: '#10b981' },
  { name: 'Furniture', value: 22, color: '#14b8a6' },
  { name: 'Jewelry', value: 15, color: '#3b82f6' },
  { name: 'Electronics', value: 12, color: '#8b5cf6' },
  { name: 'Home Services', value: 10, color: '#f59e0b' },
  { name: 'Pets', value: 8, color: '#f97316' },
  { name: 'Other', value: 5, color: '#94a3b8' },
];

// --- Portfolio Health Tab ---
export const portfolioHealthData = {
  combined: {
    autoPayAccounts: 32456,
    autoPayPct: 68.7,
    apCurrent: 96.2,
    apCurrentCount: 31234,
    apDelinquent: 1222,
    apDelinquentPct: 3.8,
    manualPay: 14778,
    manualPayPct: 31.3,
  },
};

export const autoPayVsManualDelinquency = [
  { label: 'Auto-Pay', current: 96.2, delinquent: 3.8 },
  { label: 'Manual Pay', current: 72.1, delinquent: 27.9 },
];

export const autoPayEnrollmentTrend = [
  { month: 'Aug', enrolled: 29800, pct: 89 },
  { month: 'Sep', enrolled: 30200, pct: 90 },
  { month: 'Oct', enrolled: 30800, pct: 91 },
  { month: 'Nov', enrolled: 31200, pct: 93 },
  { month: 'Dec', enrolled: 31800, pct: 95 },
  { month: 'Jan', enrolled: 32456, pct: 96 },
];

export const portfolioAging = [
  { month: 'Aug', current: 35200, dpd1_15: 2600, dpd16_30: 1200, dpd31_60: 2400, dpd61plus: 1300 },
  { month: 'Sep', current: 35800, dpd1_15: 2700, dpd16_30: 1250, dpd31_60: 2500, dpd61plus: 1350 },
  { month: 'Oct', current: 36200, dpd1_15: 2750, dpd16_30: 1300, dpd31_60: 2550, dpd61plus: 1380 },
  { month: 'Nov', current: 36800, dpd1_15: 2800, dpd16_30: 1350, dpd31_60: 2600, dpd61plus: 1400 },
  { month: 'Dec', current: 37500, dpd1_15: 2850, dpd16_30: 1400, dpd31_60: 2700, dpd61plus: 1450 },
  { month: 'Jan', current: 38542, dpd1_15: 2891, dpd16_30: 1458, dpd31_60: 2847, dpd61plus: 1496 },
];

// --- Credit & Risk Tab (NEW — from EAC Requirements) ---
export const creditRiskData = {
  overview: {
    totalFundedContracts: 52180,
    avgDRScore: 648,
    avgAPR: 24.8,
    fpdRate: 8.2,
    fpdRateTrend: -0.5,
    defaultRate61: 6.8,
    defaultRate61Trend: 0.3,
    avgAmountFinanced: 1842,
    portfolioBalance: 78.4,
  },
};

export const defaultRateByVintage = [
  { vintage: 'Jul 25', def90: 4.2, def120: 5.8, def180: 7.1, def360: 8.9 },
  { vintage: 'Aug 25', def90: 3.8, def120: 5.2, def180: 6.5, def360: 8.1 },
  { vintage: 'Sep 25', def90: 4.5, def120: 6.1, def180: 7.4, def360: null },
  { vintage: 'Oct 25', def90: 3.6, def120: 5.0, def180: null, def360: null },
  { vintage: 'Nov 25', def90: 4.1, def120: null, def180: null, def360: null },
  { vintage: 'Dec 25', def90: 3.9, def120: null, def180: null, def360: null },
];

export const creditScoreDistribution = [
  { range: '500-549', count: 4200, defaultRate: 18.5 },
  { range: '550-599', count: 8400, defaultRate: 12.3 },
  { range: '600-649', count: 14200, defaultRate: 7.8 },
  { range: '650-699', count: 12800, defaultRate: 4.2 },
  { range: '700-749', count: 8200, defaultRate: 2.1 },
  { range: '750+', count: 4380, defaultRate: 0.9 },
];

export const fpdByChannel = [
  { channel: 'QR Code', fpdRate: 6.8, volume: 12400 },
  { channel: 'LTO Instore', fpdRate: 9.2, volume: 8800 },
  { channel: 'Map App', fpdRate: 7.5, volume: 6200 },
  { channel: 'Easy Repeat', fpdRate: 3.1, volume: 4800 },
  { channel: 'Partner API', fpdRate: 8.4, volume: 3200 },
];

export const delinquencyByIndustry = [
  { industry: 'Auto', accounts: 14200, delinqRate: 5.8, exposure: 22.4 },
  { industry: 'Furniture', accounts: 10800, delinqRate: 7.2, exposure: 16.8 },
  { industry: 'Jewelry', accounts: 7400, delinqRate: 4.1, exposure: 11.2 },
  { industry: 'Electronics', accounts: 6200, delinqRate: 9.5, exposure: 8.4 },
  { industry: 'Home Services', accounts: 4800, delinqRate: 6.3, exposure: 7.1 },
  { industry: 'Pets', accounts: 3780, delinqRate: 8.8, exposure: 4.2 },
];

// --- Sales Tab (NEW — from EAC Requirements) ---
export const salesData = {
  overview: {
    totalActiveMerchants: 5124,
    newEnrollmentsMTD: 47,
    newEnrollmentsTrend: 18,
    avgDaysToFirstApp: 12,
    avgDaysToFirstFunding: 18,
    overallApprovalRate: 62.4,
    overallFundingRate: 61.3,
    totalFundedVolumeMTD: 2.8,
    totalFundedVolumeYTD: 16.4,
    dormantMerchants30: 842,
    dormantMerchants60: 384,
    merchantTerminations: 12,
  },
};

export const repScorecard = [
  { name: 'Jared Midkiff', territory: 'RIC-2', merchants: 142, fundedMTD: 284, volumeMTD: 428000, enrollmentsMTD: 20, activationRate: 88, monthlyFunded: [210, 228, 245, 258, 270, 284] },
  { name: 'Sara Porter', territory: 'RIC-4', merchants: 128, fundedMTD: 312, volumeMTD: 512000, enrollmentsMTD: 16, activationRate: 92, monthlyFunded: [240, 255, 268, 280, 298, 312] },
  { name: 'Stephanie Whitlock', territory: 'RIC-6', merchants: 118, fundedMTD: 246, volumeMTD: 368000, enrollmentsMTD: 14, activationRate: 85, monthlyFunded: [180, 195, 210, 224, 238, 246] },
  { name: 'Phillip Mason', territory: 'RIC-9', merchants: 156, fundedMTD: 298, volumeMTD: 482000, enrollmentsMTD: 13, activationRate: 90, monthlyFunded: [220, 238, 252, 268, 282, 298] },
  { name: 'Yemaira Hernandez', territory: 'RIC-2', merchants: 134, fundedMTD: 268, volumeMTD: 398000, enrollmentsMTD: 12, activationRate: 82, monthlyFunded: [200, 210, 220, 235, 250, 268] },
  { name: 'Omar Corona', territory: 'RIC-4', merchants: 112, fundedMTD: 224, volumeMTD: 342000, enrollmentsMTD: 11, activationRate: 86, monthlyFunded: [160, 175, 188, 200, 212, 224] },
];

export const enrollmentsByMonth = [
  { month: 'Aug', enrolled: 38, activated: 32, terminated: 8 },
  { month: 'Sep', enrolled: 42, activated: 36, terminated: 6 },
  { month: 'Oct', enrolled: 45, activated: 38, terminated: 10 },
  { month: 'Nov', enrolled: 40, activated: 35, terminated: 7 },
  { month: 'Dec', enrolled: 52, activated: 44, terminated: 9 },
  { month: 'Jan', enrolled: 47, activated: 40, terminated: 12 },
];

export const topMerchantsByVolume = [
  { name: 'AutoZone Premium', industry: 'Auto', state: 'TX', volumeMTD: 142000, dealsMTD: 94, approvalRate: 68.2 },
  { name: 'Comfort Living Furniture', industry: 'Furniture', state: 'CA', volumeMTD: 128000, dealsMTD: 72, approvalRate: 71.4 },
  { name: 'Diamond Direct', industry: 'Jewelry', state: 'FL', volumeMTD: 98000, dealsMTD: 48, approvalRate: 65.8 },
  { name: 'TechHub Electronics', industry: 'Electronics', state: 'NY', volumeMTD: 86000, dealsMTD: 68, approvalRate: 58.2 },
  { name: 'PetCare Plus', industry: 'Pets', state: 'GA', volumeMTD: 72000, dealsMTD: 56, approvalRate: 72.1 },
];

export const approvalRateByIndustry = [
  { industry: 'Auto', rate: 65.2 },
  { industry: 'Furniture', rate: 68.4 },
  { industry: 'Jewelry', rate: 58.1 },
  { industry: 'Electronics', rate: 55.8 },
  { industry: 'Home Services', rate: 70.2 },
  { industry: 'Pets', rate: 72.5 },
];

// --- Merchant Services Tab (Standalone Department) ---
export const merchantServicesData = {
  overview: {
    totalPartners: 5124,
    totalPartnersTrend: 2.8,
    activePartners: 4282,
    activePartnersPct: 83.6,
    newOnboardedMTD: 47,
    newOnboardedTrend: 18,
    avgOnboardingDays: 4.2,
    partnerSatisfaction: 4.5,
    partnerSatisfactionMax: 5.0,
    supportTicketsOpen: 142,
    supportTicketsTrend: -6.2,
    avgResolutionHours: 18.4,
    avgResolutionTarget: 24,
    merchantChurnRate: 2.1,
    merchantChurnTrend: 0.3,
    reactivatedMTD: 28,
    integrationUptime: 99.7,
  },
};

export const merchantPartnerGrowth = [
  { month: 'Aug', total: 4680, active: 3920, new: 38 },
  { month: 'Sep', total: 4780, active: 3990, new: 42 },
  { month: 'Oct', total: 4850, active: 4050, new: 45 },
  { month: 'Nov', total: 4920, active: 4120, new: 40 },
  { month: 'Dec', total: 5020, active: 4200, new: 52 },
  { month: 'Jan', total: 5124, active: 4282, new: 47 },
];

export const merchantSupportVolume = [
  { month: 'Aug', opened: 168, resolved: 172, avgHours: 22.1 },
  { month: 'Sep', opened: 155, resolved: 160, avgHours: 20.8 },
  { month: 'Oct', opened: 178, resolved: 175, avgHours: 21.4 },
  { month: 'Nov', opened: 148, resolved: 152, avgHours: 19.2 },
  { month: 'Dec', opened: 162, resolved: 158, avgHours: 18.8 },
  { month: 'Jan', opened: 142, resolved: 148, avgHours: 18.4 },
];

export const merchantTierDistribution = [
  { tier: 'Platinum', count: 312, volume: 1420000, pctTotal: 42 },
  { tier: 'Gold', count: 842, volume: 980000, pctTotal: 28 },
  { tier: 'Silver', count: 1628, volume: 620000, pctTotal: 18 },
  { tier: 'Bronze', count: 2342, volume: 380000, pctTotal: 12 },
];

export const merchantTopIssues = [
  { category: 'App Processing', tickets: 42, pct: 29.6, trend: -8 },
  { category: 'Payment Issues', tickets: 28, pct: 19.7, trend: 5 },
  { category: 'Portal Access', tickets: 24, pct: 16.9, trend: -12 },
  { category: 'Contract Questions', tickets: 22, pct: 15.5, trend: 3 },
  { category: 'Integration', tickets: 16, pct: 11.3, trend: -15 },
  { category: 'Other', tickets: 10, pct: 7.0, trend: 0 },
];

// --- Compliance Tab ---
export const complianceData = {
  overview: {
    openFindings: 12,
    openFindingsTrend: -2,
    criticalFindings: 2,
    regulatoryExams: 3,
    examsPassed: 2,
    examsInProgress: 1,
    complaintsMTD: 48,
    complaintsTrend: -8.4,
    avgResolutionDays: 6.2,
    resolutionTarget: 10,
    trainingCompliancePct: 94.2,
    trainingTarget: 100,
    policiesUpForReview: 8,
    policiesOverdue: 1,
    bsaFilingsMTD: 124,
    bsaFilingsTrend: 3.2,
    auditReadiness: 87,
  },
};

export const complianceFindingsTrend = [
  { month: 'Aug', open: 18, resolved: 12, critical: 4 },
  { month: 'Sep', open: 16, resolved: 14, critical: 3 },
  { month: 'Oct', open: 15, resolved: 11, critical: 3 },
  { month: 'Nov', open: 14, resolved: 13, critical: 2 },
  { month: 'Dec', open: 13, resolved: 10, critical: 2 },
  { month: 'Jan', open: 12, resolved: 14, critical: 2 },
];

export const complaintsByCategory = [
  { name: 'Billing Disputes', value: 32, color: '#3b82f6' },
  { name: 'Service Quality', value: 24, color: '#10b981' },
  { name: 'Collections Practices', value: 18, color: '#f59e0b' },
  { name: 'Disclosure Issues', value: 14, color: '#ef4444' },
  { name: 'Privacy/Data', value: 8, color: '#8b5cf6' },
  { name: 'Other', value: 4, color: '#94a3b8' },
];

export const complaintsTrend = [
  { month: 'Aug', complaints: 62, resolved: 58, avgDays: 7.8 },
  { month: 'Sep', complaints: 58, resolved: 55, avgDays: 7.2 },
  { month: 'Oct', complaints: 54, resolved: 52, avgDays: 6.8 },
  { month: 'Nov', complaints: 52, resolved: 50, avgDays: 6.5 },
  { month: 'Dec', complaints: 50, resolved: 48, avgDays: 6.4 },
  { month: 'Jan', complaints: 48, resolved: 46, avgDays: 6.2 },
];

export const regulatoryExams = [
  { name: 'CFPB Annual Review', status: 'Passed', date: 'Nov 2025', findings: 2, remediated: 2 },
  { name: 'State Licensing Audit', status: 'Passed', date: 'Dec 2025', findings: 1, remediated: 1 },
  { name: 'BSA/AML Review', status: 'In Progress', date: 'Feb 2026', findings: null, remediated: null },
];

export const trainingComplianceByDept = [
  { dept: 'Collections', completed: 98, total: 100, pct: 98 },
  { dept: 'Customer Care', completed: 72, total: 75, pct: 96 },
  { dept: 'Originations', completed: 44, total: 48, pct: 91.7 },
  { dept: 'Sales', completed: 28, total: 30, pct: 93.3 },
  { dept: 'Merchant Services', completed: 7, total: 8, pct: 87.5 },
  { dept: 'Finance', completed: 12, total: 12, pct: 100 },
];

// --- Finance & Accounting Tab ---
export const financeData = {
  overview: {
    totalRevenueMTD: 4.82,
    totalRevenueTrend: 6.4,
    totalRevenueYTD: 28.6,
    interestIncome: 3.24,
    interestIncomePct: 67.2,
    feeIncome: 1.58,
    feeIncomePct: 32.8,
    netChargeOffsMTD: 0.42,
    netChargeOffRate: 1.8,
    netChargeOffTrend: 0.2,
    operatingExpenses: 2.14,
    operatingExpensesTrend: -3.1,
    efficiencyRatio: 44.4,
    efficiencyTarget: 45,
    provisionExpense: 0.38,
    provisionTrend: -5.2,
    netIncome: 1.88,
    netIncomeTrend: 8.6,
    portfolioYield: 18.2,
  },
};

export const revenueByMonth = [
  { month: 'Aug', interest: 2.98, fees: 1.42, total: 4.40 },
  { month: 'Sep', interest: 3.02, fees: 1.44, total: 4.46 },
  { month: 'Oct', interest: 3.08, fees: 1.48, total: 4.56 },
  { month: 'Nov', interest: 3.12, fees: 1.50, total: 4.62 },
  { month: 'Dec', interest: 3.18, fees: 1.54, total: 4.72 },
  { month: 'Jan', interest: 3.24, fees: 1.58, total: 4.82 },
];

export const expenseBreakdown = [
  { name: 'Personnel', value: 42, color: '#3b82f6' },
  { name: 'Technology', value: 18, color: '#10b981' },
  { name: 'Facility', value: 12, color: '#f59e0b' },
  { name: 'Marketing', value: 10, color: '#8b5cf6' },
  { name: 'Professional Svcs', value: 8, color: '#14b8a6' },
  { name: 'Other', value: 10, color: '#94a3b8' },
];

export const chargeOffTrend = [
  { month: 'Aug', grossCO: 0.52, recoveries: 0.14, netCO: 0.38 },
  { month: 'Sep', grossCO: 0.54, recoveries: 0.15, netCO: 0.39 },
  { month: 'Oct', grossCO: 0.50, recoveries: 0.12, netCO: 0.38 },
  { month: 'Nov', grossCO: 0.56, recoveries: 0.16, netCO: 0.40 },
  { month: 'Dec', grossCO: 0.58, recoveries: 0.17, netCO: 0.41 },
  { month: 'Jan', grossCO: 0.58, recoveries: 0.16, netCO: 0.42 },
];

export const profitabilityTrend = [
  { month: 'Aug', revenue: 4.40, expenses: 2.22, provision: 0.42, netIncome: 1.56 },
  { month: 'Sep', revenue: 4.46, expenses: 2.20, provision: 0.40, netIncome: 1.66 },
  { month: 'Oct', revenue: 4.56, expenses: 2.18, provision: 0.41, netIncome: 1.77 },
  { month: 'Nov', revenue: 4.62, expenses: 2.16, provision: 0.39, netIncome: 1.87 },
  { month: 'Dec', revenue: 4.72, expenses: 2.15, provision: 0.38, netIncome: 1.99 },
  { month: 'Jan', revenue: 4.82, expenses: 2.14, provision: 0.38, netIncome: 1.88 },
];

export const arAgingBuckets = [
  { bucket: 'Current', amount: 58.3, pct: 74.4 },
  { bucket: '1-30 Days', amount: 8.2, pct: 10.5 },
  { bucket: '31-60 Days', amount: 6.1, pct: 7.8 },
  { bucket: '61-90 Days', amount: 3.4, pct: 4.3 },
  { bucket: '90+ Days', amount: 2.4, pct: 3.0 },
];

// --- Merchant Profiles (CRM Data) ---
export type MerchantProfile = {
  id: string;
  name: string;
  dba: string;
  industry: string;
  state: string;
  city: string;
  phone: string;
  email: string;
  enrolledDate: string;
  firstFundedDate: string | null;
  status: 'Active' | 'Dormant' | 'Suspended' | 'Terminated';
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  assignedRep: string;
  territory: string;
  volumeMTD: number;
  volumeYTD: number;
  dealsMTD: number;
  dealsYTD: number;
  approvalRate: number;
  avgTicket: number;
  fundingRate: number;
  autoPayAttachRate: number;
  delinquencyRate: number;
  chargebackRate: number;
  fpdRate: number;
  monthlyVolume: { month: string; volume: number; deals: number }[];
  recentActivity: { date: string; type: string; note: string }[];
};

export const merchantProfiles: MerchantProfile[] = [
  {
    id: 'M001', name: 'AutoZone Premium', dba: 'AutoZone Premium Auto', industry: 'Auto', state: 'TX', city: 'Houston',
    phone: '(713) 555-0142', email: 'partners@autozonepremium.com', enrolledDate: '2024-03-15', firstFundedDate: '2024-03-22',
    status: 'Active', tier: 'Platinum', assignedRep: 'Marcus Johnson', territory: 'Southeast',
    volumeMTD: 142000, volumeYTD: 824000, dealsMTD: 94, dealsYTD: 548, approvalRate: 68.2, avgTicket: 1511, fundingRate: 62.4, autoPayAttachRate: 78.2,
    delinquencyRate: 4.8, chargebackRate: 1.2, fpdRate: 6.1,
    monthlyVolume: [{ month: 'Aug', volume: 118000, deals: 78 }, { month: 'Sep', volume: 125000, deals: 82 }, { month: 'Oct', volume: 130000, deals: 86 }, { month: 'Nov', volume: 135000, deals: 88 }, { month: 'Dec', volume: 138000, deals: 91 }, { month: 'Jan', volume: 142000, deals: 94 }],
    recentActivity: [
      { date: '2026-02-28', type: 'Call', note: 'Quarterly review — discussed volume targets for Q2.' },
      { date: '2026-02-15', type: 'Email', note: 'Sent updated rate sheet and promotional materials.' },
      { date: '2026-01-30', type: 'Visit', note: 'On-site training for new staff on application process.' },
    ],
  },
  {
    id: 'M002', name: 'Comfort Living Furniture', dba: 'Comfort Living', industry: 'Furniture', state: 'CA', city: 'Los Angeles',
    phone: '(310) 555-0198', email: 'finance@comfortliving.com', enrolledDate: '2024-01-10', firstFundedDate: '2024-01-18',
    status: 'Active', tier: 'Platinum', assignedRep: 'Sarah Chen', territory: 'West Coast',
    volumeMTD: 128000, volumeYTD: 762000, dealsMTD: 72, dealsYTD: 436, approvalRate: 71.4, avgTicket: 1778, fundingRate: 65.8, autoPayAttachRate: 82.1,
    delinquencyRate: 3.2, chargebackRate: 0.8, fpdRate: 4.5,
    monthlyVolume: [{ month: 'Aug', volume: 104000, deals: 58 }, { month: 'Sep', volume: 110000, deals: 62 }, { month: 'Oct', volume: 115000, deals: 65 }, { month: 'Nov', volume: 120000, deals: 68 }, { month: 'Dec', volume: 124000, deals: 70 }, { month: 'Jan', volume: 128000, deals: 72 }],
    recentActivity: [
      { date: '2026-02-25', type: 'Call', note: 'Discussed expansion to second showroom in San Diego.' },
      { date: '2026-02-10', type: 'Email', note: 'Sent Q1 performance summary and co-marketing proposal.' },
    ],
  },
  {
    id: 'M003', name: 'Diamond Direct', dba: 'Diamond Direct Jewelers', industry: 'Jewelry', state: 'FL', city: 'Miami',
    phone: '(305) 555-0167', email: 'ops@diamonddirect.com', enrolledDate: '2024-06-20', firstFundedDate: '2024-07-02',
    status: 'Active', tier: 'Gold', assignedRep: 'Lisa Park', territory: 'Northeast',
    volumeMTD: 98000, volumeYTD: 584000, dealsMTD: 48, dealsYTD: 292, approvalRate: 65.8, avgTicket: 2042, fundingRate: 58.4, autoPayAttachRate: 72.8,
    delinquencyRate: 5.1, chargebackRate: 1.5, fpdRate: 7.2,
    monthlyVolume: [{ month: 'Aug', volume: 82000, deals: 40 }, { month: 'Sep', volume: 86000, deals: 42 }, { month: 'Oct', volume: 88000, deals: 43 }, { month: 'Nov', volume: 92000, deals: 45 }, { month: 'Dec', volume: 95000, deals: 47 }, { month: 'Jan', volume: 98000, deals: 48 }],
    recentActivity: [
      { date: '2026-03-01', type: 'Call', note: 'Follow-up on declined application volume — reviewing underwriting criteria.' },
      { date: '2026-02-18', type: 'Email', note: 'Holiday promotion results — 22% volume increase.' },
    ],
  },
  {
    id: 'M004', name: 'TechHub Electronics', dba: 'TechHub', industry: 'Electronics', state: 'NY', city: 'New York',
    phone: '(212) 555-0234', email: 'accounting@techhub.com', enrolledDate: '2024-09-05', firstFundedDate: '2024-09-12',
    status: 'Active', tier: 'Gold', assignedRep: 'Lisa Park', territory: 'Northeast',
    volumeMTD: 86000, volumeYTD: 498000, dealsMTD: 68, dealsYTD: 402, approvalRate: 58.2, avgTicket: 1265, fundingRate: 54.8, autoPayAttachRate: 68.4,
    delinquencyRate: 8.2, chargebackRate: 2.4, fpdRate: 9.8,
    monthlyVolume: [{ month: 'Aug', volume: 72000, deals: 56 }, { month: 'Sep', volume: 74000, deals: 58 }, { month: 'Oct', volume: 78000, deals: 62 }, { month: 'Nov', volume: 80000, deals: 64 }, { month: 'Dec', volume: 84000, deals: 66 }, { month: 'Jan', volume: 86000, deals: 68 }],
    recentActivity: [
      { date: '2026-02-20', type: 'Call', note: 'High delinquency review — action plan to improve auto-pay attachment.' },
      { date: '2026-02-05', type: 'Visit', note: 'Store visit to audit application process and signage.' },
    ],
  },
  {
    id: 'M005', name: 'PetCare Plus', dba: 'PetCare Plus Veterinary', industry: 'Pets', state: 'GA', city: 'Atlanta',
    phone: '(404) 555-0189', email: 'admin@petcareplus.com', enrolledDate: '2024-04-12', firstFundedDate: '2024-04-20',
    status: 'Active', tier: 'Gold', assignedRep: 'Marcus Johnson', territory: 'Southeast',
    volumeMTD: 72000, volumeYTD: 428000, dealsMTD: 56, dealsYTD: 338, approvalRate: 72.1, avgTicket: 1286, fundingRate: 68.2, autoPayAttachRate: 80.5,
    delinquencyRate: 3.8, chargebackRate: 0.6, fpdRate: 5.2,
    monthlyVolume: [{ month: 'Aug', volume: 58000, deals: 44 }, { month: 'Sep', volume: 62000, deals: 48 }, { month: 'Oct', volume: 64000, deals: 50 }, { month: 'Nov', volume: 66000, deals: 52 }, { month: 'Dec', volume: 70000, deals: 54 }, { month: 'Jan', volume: 72000, deals: 56 }],
    recentActivity: [
      { date: '2026-02-22', type: 'Call', note: 'Discussed adding second vet location to the program.' },
      { date: '2026-02-08', type: 'Email', note: 'Sent pet care financing promotional kit.' },
    ],
  },
  {
    id: 'M006', name: 'Sunrise Home Services', dba: 'Sunrise HVAC & Plumbing', industry: 'Home Services', state: 'AZ', city: 'Phoenix',
    phone: '(602) 555-0156', email: 'finance@sunrisehomesvcs.com', enrolledDate: '2024-07-18', firstFundedDate: '2024-07-28',
    status: 'Active', tier: 'Silver', assignedRep: 'David Rodriguez', territory: 'Southwest',
    volumeMTD: 54000, volumeYTD: 318000, dealsMTD: 32, dealsYTD: 192, approvalRate: 74.8, avgTicket: 1688, fundingRate: 70.2, autoPayAttachRate: 85.1,
    delinquencyRate: 2.8, chargebackRate: 0.4, fpdRate: 3.8,
    monthlyVolume: [{ month: 'Aug', volume: 42000, deals: 24 }, { month: 'Sep', volume: 44000, deals: 26 }, { month: 'Oct', volume: 48000, deals: 28 }, { month: 'Nov', volume: 50000, deals: 30 }, { month: 'Dec', volume: 52000, deals: 31 }, { month: 'Jan', volume: 54000, deals: 32 }],
    recentActivity: [
      { date: '2026-02-26', type: 'Call', note: 'Exploring expansion into roofing services financing.' },
    ],
  },
  {
    id: 'M007', name: 'Metro Wheels Auto', dba: 'Metro Wheels', industry: 'Auto', state: 'IL', city: 'Chicago',
    phone: '(312) 555-0211', email: 'sales@metrowheels.com', enrolledDate: '2025-01-10', firstFundedDate: '2025-01-22',
    status: 'Active', tier: 'Silver', assignedRep: 'James Wilson', territory: 'Midwest',
    volumeMTD: 48000, volumeYTD: 286000, dealsMTD: 28, dealsYTD: 168, approvalRate: 62.4, avgTicket: 1714, fundingRate: 58.8, autoPayAttachRate: 71.2,
    delinquencyRate: 6.1, chargebackRate: 1.8, fpdRate: 7.4,
    monthlyVolume: [{ month: 'Aug', volume: 38000, deals: 22 }, { month: 'Sep', volume: 40000, deals: 23 }, { month: 'Oct', volume: 42000, deals: 24 }, { month: 'Nov', volume: 44000, deals: 26 }, { month: 'Dec', volume: 46000, deals: 27 }, { month: 'Jan', volume: 48000, deals: 28 }],
    recentActivity: [
      { date: '2026-02-24', type: 'Call', note: 'New location opening in Milwaukee — enrollment in progress.' },
      { date: '2026-02-12', type: 'Email', note: 'Sent tire & wheel financing promotional bundle.' },
    ],
  },
  {
    id: 'M008', name: 'Luxe Jewelers', dba: 'Luxe Fine Jewelry', industry: 'Jewelry', state: 'NV', city: 'Las Vegas',
    phone: '(702) 555-0178', email: 'mgmt@luxejewelers.com', enrolledDate: '2024-11-20', firstFundedDate: '2024-12-05',
    status: 'Active', tier: 'Silver', assignedRep: 'Sarah Chen', territory: 'West Coast',
    volumeMTD: 42000, volumeYTD: 248000, dealsMTD: 22, dealsYTD: 128, approvalRate: 60.2, avgTicket: 1909, fundingRate: 56.4, autoPayAttachRate: 74.8,
    delinquencyRate: 5.8, chargebackRate: 1.6, fpdRate: 7.8,
    monthlyVolume: [{ month: 'Aug', volume: 32000, deals: 16 }, { month: 'Sep', volume: 34000, deals: 18 }, { month: 'Oct', volume: 36000, deals: 19 }, { month: 'Nov', volume: 38000, deals: 20 }, { month: 'Dec', volume: 40000, deals: 21 }, { month: 'Jan', volume: 42000, deals: 22 }],
    recentActivity: [
      { date: '2026-02-28', type: 'Visit', note: 'In-store training on new mobile application workflow.' },
    ],
  },
  {
    id: 'M009', name: 'Southern Comfort Beds', dba: 'Southern Comfort', industry: 'Furniture', state: 'TN', city: 'Nashville',
    phone: '(615) 555-0145', email: 'billing@southerncomfort.com', enrolledDate: '2025-03-08', firstFundedDate: '2025-03-18',
    status: 'Active', tier: 'Bronze', assignedRep: 'Marcus Johnson', territory: 'Southeast',
    volumeMTD: 28000, volumeYTD: 164000, dealsMTD: 18, dealsYTD: 108, approvalRate: 66.8, avgTicket: 1556, fundingRate: 62.1, autoPayAttachRate: 76.4,
    delinquencyRate: 4.2, chargebackRate: 0.9, fpdRate: 5.8,
    monthlyVolume: [{ month: 'Aug', volume: 20000, deals: 12 }, { month: 'Sep', volume: 22000, deals: 14 }, { month: 'Oct', volume: 24000, deals: 15 }, { month: 'Nov', volume: 25000, deals: 16 }, { month: 'Dec', volume: 26000, deals: 17 }, { month: 'Jan', volume: 28000, deals: 18 }],
    recentActivity: [
      { date: '2026-02-18', type: 'Call', note: 'Onboarding progress check — first month performance review.' },
    ],
  },
  {
    id: 'M010', name: 'Paws & Claws Vet', dba: 'Paws & Claws', industry: 'Pets', state: 'CO', city: 'Denver',
    phone: '(303) 555-0192', email: 'office@pawsandclaws.com', enrolledDate: '2024-08-25', firstFundedDate: '2024-09-05',
    status: 'Active', tier: 'Silver', assignedRep: 'Maria Garcia', territory: 'Central',
    volumeMTD: 38000, volumeYTD: 224000, dealsMTD: 28, dealsYTD: 168, approvalRate: 76.2, avgTicket: 1357, fundingRate: 72.8, autoPayAttachRate: 84.2,
    delinquencyRate: 2.4, chargebackRate: 0.3, fpdRate: 3.2,
    monthlyVolume: [{ month: 'Aug', volume: 28000, deals: 20 }, { month: 'Sep', volume: 30000, deals: 22 }, { month: 'Oct', volume: 32000, deals: 24 }, { month: 'Nov', volume: 34000, deals: 25 }, { month: 'Dec', volume: 36000, deals: 27 }, { month: 'Jan', volume: 38000, deals: 28 }],
    recentActivity: [
      { date: '2026-02-20', type: 'Email', note: 'Sent referral program details for partner veterinarians.' },
    ],
  },
  {
    id: 'M011', name: 'Elite Electronics', dba: 'Elite Tech Store', industry: 'Electronics', state: 'WA', city: 'Seattle',
    phone: '(206) 555-0234', email: 'ops@eliteelectronics.com', enrolledDate: '2025-06-15', firstFundedDate: null,
    status: 'Dormant', tier: 'Bronze', assignedRep: 'Sarah Chen', territory: 'West Coast',
    volumeMTD: 0, volumeYTD: 0, dealsMTD: 0, dealsYTD: 0, approvalRate: 0, avgTicket: 0, fundingRate: 0, autoPayAttachRate: 0,
    delinquencyRate: 0, chargebackRate: 0, fpdRate: 0,
    monthlyVolume: [{ month: 'Aug', volume: 0, deals: 0 }, { month: 'Sep', volume: 0, deals: 0 }, { month: 'Oct', volume: 0, deals: 0 }, { month: 'Nov', volume: 0, deals: 0 }, { month: 'Dec', volume: 0, deals: 0 }, { month: 'Jan', volume: 0, deals: 0 }],
    recentActivity: [
      { date: '2026-02-10', type: 'Call', note: 'Re-engagement attempt — owner undecided on financing program.' },
      { date: '2026-01-15', type: 'Email', note: 'Sent activation incentive offer.' },
    ],
  },
  {
    id: 'M012', name: 'Valley View Dental', dba: 'Valley View Dental Care', industry: 'Home Services', state: 'CA', city: 'San Diego',
    phone: '(619) 555-0167', email: 'front@valleyviewdental.com', enrolledDate: '2024-05-10', firstFundedDate: '2024-05-18',
    status: 'Active', tier: 'Gold', assignedRep: 'Sarah Chen', territory: 'West Coast',
    volumeMTD: 62000, volumeYTD: 368000, dealsMTD: 38, dealsYTD: 228, approvalRate: 78.4, avgTicket: 1632, fundingRate: 74.2, autoPayAttachRate: 88.6,
    delinquencyRate: 1.8, chargebackRate: 0.2, fpdRate: 2.4,
    monthlyVolume: [{ month: 'Aug', volume: 48000, deals: 30 }, { month: 'Sep', volume: 52000, deals: 32 }, { month: 'Oct', volume: 54000, deals: 33 }, { month: 'Nov', volume: 56000, deals: 34 }, { month: 'Dec', volume: 58000, deals: 36 }, { month: 'Jan', volume: 62000, deals: 38 }],
    recentActivity: [
      { date: '2026-03-01', type: 'Call', note: 'Outstanding partner — discussing referral program for other practices.' },
      { date: '2026-02-14', type: 'Email', note: 'Sent patient financing toolkit for cosmetic procedures.' },
    ],
  },
  {
    id: 'M013', name: 'Bella Casa Furniture', dba: 'Bella Casa', industry: 'Furniture', state: 'TX', city: 'Dallas',
    phone: '(214) 555-0188', email: 'finance@bellacasa.com', enrolledDate: '2024-10-01', firstFundedDate: '2024-10-08',
    status: 'Active', tier: 'Silver', assignedRep: 'David Rodriguez', territory: 'Southwest',
    volumeMTD: 46000, volumeYTD: 272000, dealsMTD: 26, dealsYTD: 156, approvalRate: 70.2, avgTicket: 1769, fundingRate: 66.8, autoPayAttachRate: 79.4,
    delinquencyRate: 3.6, chargebackRate: 0.7, fpdRate: 4.8,
    monthlyVolume: [{ month: 'Aug', volume: 36000, deals: 20 }, { month: 'Sep', volume: 38000, deals: 21 }, { month: 'Oct', volume: 40000, deals: 22 }, { month: 'Nov', volume: 42000, deals: 24 }, { month: 'Dec', volume: 44000, deals: 25 }, { month: 'Jan', volume: 46000, deals: 26 }],
    recentActivity: [
      { date: '2026-02-22', type: 'Visit', note: 'Showroom visit — reviewed POS integration and signage placement.' },
    ],
  },
  {
    id: 'M014', name: 'RoadMaster Tires', dba: 'RoadMaster', industry: 'Auto', state: 'OH', city: 'Columbus',
    phone: '(614) 555-0211', email: 'manager@roadmastertires.com', enrolledDate: '2025-08-20', firstFundedDate: '2025-09-02',
    status: 'Active', tier: 'Bronze', assignedRep: 'James Wilson', territory: 'Midwest',
    volumeMTD: 22000, volumeYTD: 128000, dealsMTD: 16, dealsYTD: 96, approvalRate: 64.8, avgTicket: 1375, fundingRate: 60.2, autoPayAttachRate: 70.8,
    delinquencyRate: 5.4, chargebackRate: 1.4, fpdRate: 6.8,
    monthlyVolume: [{ month: 'Aug', volume: 14000, deals: 10 }, { month: 'Sep', volume: 16000, deals: 11 }, { month: 'Oct', volume: 18000, deals: 13 }, { month: 'Nov', volume: 19000, deals: 14 }, { month: 'Dec', volume: 20000, deals: 15 }, { month: 'Jan', volume: 22000, deals: 16 }],
    recentActivity: [
      { date: '2026-02-15', type: 'Call', note: 'Volume growth review — on track for Silver tier upgrade.' },
    ],
  },
  {
    id: 'M015', name: 'Peak Performance Gym', dba: 'Peak Performance', industry: 'Home Services', state: 'NC', city: 'Charlotte',
    phone: '(704) 555-0178', email: 'admin@peakperformancegym.com', enrolledDate: '2024-12-01', firstFundedDate: '2024-12-12',
    status: 'Dormant', tier: 'Bronze', assignedRep: 'Marcus Johnson', territory: 'Southeast',
    volumeMTD: 0, volumeYTD: 42000, dealsMTD: 0, dealsYTD: 28, approvalRate: 58.4, avgTicket: 1500, fundingRate: 52.8, autoPayAttachRate: 65.2,
    delinquencyRate: 9.2, chargebackRate: 2.8, fpdRate: 11.4,
    monthlyVolume: [{ month: 'Aug', volume: 12000, deals: 8 }, { month: 'Sep', volume: 10000, deals: 6 }, { month: 'Oct', volume: 8000, deals: 5 }, { month: 'Nov', volume: 6000, deals: 4 }, { month: 'Dec', volume: 4000, deals: 3 }, { month: 'Jan', volume: 0, deals: 0 }],
    recentActivity: [
      { date: '2026-02-28', type: 'Call', note: 'Owner cited high delinquency as reason for pausing. Discussing remediation.' },
      { date: '2026-01-20', type: 'Email', note: 'Sent re-engagement offer with reduced rates.' },
    ],
  },
];

// --- KPI Drill-Down Detail Data ---
// Used by KPICard modals when a card is clicked
export const kpiDetails = {
  // Executive Summary
  activeAccounts: {
    history: [
      { period: 'Aug', value: 43200 }, { period: 'Sep', value: 44100 }, { period: 'Oct', value: 45000 },
      { period: 'Nov', value: 45800 }, { period: 'Dec', value: 46500 }, { period: 'Jan', value: 47234 },
    ],
    breakdown: [
      { label: 'Finance (RIC)', value: '28,412', pct: 60.2, status: 'green' as const },
      { label: 'LTO', value: '18,822', pct: 39.8, status: 'green' as const },
    ],
    insights: [
      'Steady growth of ~3.2% MoM across both portfolios.',
      'Finance portfolio accounts for 60% of all active accounts.',
      'LTO growth accelerating due to new merchant onboarding.',
    ],
  },
  current0DPD: {
    history: [
      { period: 'Aug', value: 80.2 }, { period: 'Sep', value: 80.5 }, { period: 'Oct', value: 80.8 },
      { period: 'Nov', value: 81.0 }, { period: 'Dec', value: 81.3 }, { period: 'Jan', value: 81.6 },
    ],
    breakdown: [
      { label: 'Finance (RIC)', value: '83.4%', status: 'green' as const },
      { label: 'LTO', value: '78.8%', status: 'orange' as const },
    ],
    insights: [
      'Current rate has been steadily improving over the past 6 months.',
      'Finance portfolio outperforms LTO by ~5 percentage points.',
      'Auto-pay accounts maintain 96.2% current rate vs 72.1% for manual pay.',
    ],
    target: '85%',
  },
  atRisk31_60: {
    history: [
      { period: 'Aug', value: 2400 }, { period: 'Sep', value: 2500 }, { period: 'Oct', value: 2550 },
      { period: 'Nov', value: 2600 }, { period: 'Dec', value: 2700 }, { period: 'Jan', value: 2847 },
    ],
    breakdown: [
      { label: 'Finance (RIC)', value: '1,624', pct: 57.0, status: 'orange' as const },
      { label: 'LTO', value: '1,223', pct: 43.0, status: 'red' as const },
    ],
    insights: [
      '8.3% increase MoM — trending in the wrong direction.',
      'LTO disproportionately represented at 43% vs 40% of total portfolio.',
      'Electronics and Pets verticals driving most of the increase.',
    ],
  },
  default61Plus: {
    history: [
      { period: 'Aug', value: 1300 }, { period: 'Sep', value: 1350 }, { period: 'Oct', value: 1380 },
      { period: 'Nov', value: 1400 }, { period: 'Dec', value: 1450 }, { period: 'Jan', value: 1496 },
    ],
    breakdown: [
      { label: 'Finance (RIC)', value: '812', pct: 54.3, status: 'red' as const },
      { label: 'LTO', value: '684', pct: 45.7, status: 'red' as const },
    ],
    insights: [
      'Default rate at 3.2% — within tolerance but requires monitoring.',
      'Total exposure of $2.8M in 61+ DPD accounts.',
      'Recovery rate on 61+ accounts averaging 14.8%.',
    ],
  },
  saveRate: {
    history: [
      { period: 'Aug', value: 52 }, { period: 'Sep', value: 50 }, { period: 'Oct', value: 48 },
      { period: 'Nov', value: 47 }, { period: 'Dec', value: 46 }, { period: 'Jan', value: 45 },
    ],
    breakdown: [
      { label: 'Finance (RIC)', value: '48.2%', status: 'orange' as const },
      { label: 'LTO', value: '40.1%', status: 'red' as const },
    ],
    insights: [
      'Declining trend over 6 months — down from 52% to 45%.',
      'LTO save rate critically low at 40.1%, well below target.',
      'Payment plan offers showing improved save rates when applied.',
    ],
    target: '46%',
  },
  collectionsMTD: {
    history: [
      { period: 'Aug', value: 1.52 }, { period: 'Sep', value: 1.58 }, { period: 'Oct', value: 1.62 },
      { period: 'Nov', value: 1.68 }, { period: 'Dec', value: 1.74 }, { period: 'Jan', value: 1.80 },
    ],
    breakdown: [
      { label: 'Auto-Pay', value: '$810K', pct: 45 },
      { label: 'Agent Collections', value: '$450K', pct: 25 },
      { label: 'Self-Service', value: '$396K', pct: 22 },
      { label: 'Payment Plans', value: '$144K', pct: 8 },
    ],
    insights: [
      'Collections at 92% of monthly target — on track.',
      'Auto-pay channel continues to be the strongest contributor.',
      'Self-service portal usage growing steadily at 22% of mix.',
    ],
    target: '$1.96M',
  },
};

// --- Enrollment & Production Data (Sales Tab) ---

export const enrollmentOverview = {
  totalEnrollments: 171,
  creditedToOSR: 132,
  creditedPct: 77.2,
  otherSources: 39,
  fundedVolume: 166552,
  fundedApps: 81,
  totalApps: 390,
  conversionRate: 20.8,
  activeMerchants: 70,
  producingMerchants: 35,
  avgTicket: 2056,
};

export const enrollmentReps = [
  { name: 'Jared Midkiff', territory: 'RIC-2', enrollmentsMTD: 20, creditedMTD: 18, fundedVolume: 48200, fundedApps: 14, totalApps: 52, activeMerchants: 12, producingMerchants: 8, monthlyEnrollments: [12, 14, 16, 18, 15, 20] },
  { name: 'Sara Porter', territory: 'RIC-4', enrollmentsMTD: 16, creditedMTD: 14, fundedVolume: 38400, fundedApps: 11, totalApps: 44, activeMerchants: 10, producingMerchants: 6, monthlyEnrollments: [10, 11, 13, 12, 14, 16] },
  { name: 'Stephanie Whitlock', territory: 'RIC-6', enrollmentsMTD: 14, creditedMTD: 12, fundedVolume: 28600, fundedApps: 9, totalApps: 38, activeMerchants: 9, producingMerchants: 5, monthlyEnrollments: [8, 10, 11, 12, 13, 14] },
  { name: 'Phillip Mason', territory: 'RIC-9', enrollmentsMTD: 13, creditedMTD: 11, fundedVolume: 22800, fundedApps: 8, totalApps: 34, activeMerchants: 8, producingMerchants: 4, monthlyEnrollments: [7, 9, 10, 11, 12, 13] },
  { name: 'Yemaira Hernandez', territory: 'RIC-2', enrollmentsMTD: 12, creditedMTD: 10, fundedVolume: 18200, fundedApps: 7, totalApps: 28, activeMerchants: 7, producingMerchants: 4, monthlyEnrollments: [6, 8, 9, 10, 11, 12] },
  { name: 'Omar Corona', territory: 'RIC-4', enrollmentsMTD: 11, creditedMTD: 9, fundedVolume: 14800, fundedApps: 6, totalApps: 24, activeMerchants: 6, producingMerchants: 3, monthlyEnrollments: [5, 7, 8, 9, 10, 11] },
  { name: 'DeLon Phoenix', territory: 'RIC-6', enrollmentsMTD: 9, creditedMTD: 8, fundedVolume: 32400, fundedApps: 10, totalApps: 32, activeMerchants: 8, producingMerchants: 5, monthlyEnrollments: [4, 5, 7, 8, 8, 9] },
  { name: 'Eric Henderson', territory: 'RIC-9', enrollmentsMTD: 8, creditedMTD: 7, fundedVolume: 12200, fundedApps: 5, totalApps: 20, activeMerchants: 5, producingMerchants: 3, monthlyEnrollments: [3, 4, 5, 6, 7, 8] },
];

export const isrAssignments = [
  { name: 'Javier Gonzalez', enrollmentsSupported: 38, territory: 'RIC-2' },
  { name: 'Laura Angulo', enrollmentsSupported: 33, territory: 'RIC-4' },
  { name: 'Katie Anguiano', enrollmentsSupported: 17, territory: 'RIC-6' },
  { name: 'Luzmam Vigil', enrollmentsSupported: 16, territory: 'RIC-9' },
  { name: 'Michael Palmer', enrollmentsSupported: 13, territory: 'RIC-2' },
];

export const dailyEnrollmentPace = [
  { day: 'Feb 3', count: 5 }, { day: 'Feb 4', count: 7 }, { day: 'Feb 5', count: 4 }, { day: 'Feb 6', count: 8 },
  { day: 'Feb 7', count: 6 }, { day: 'Feb 10', count: 9 }, { day: 'Feb 11', count: 5 }, { day: 'Feb 12', count: 7 },
  { day: 'Feb 13', count: 6 }, { day: 'Feb 14', count: 8 }, { day: 'Feb 16', count: 21 }, { day: 'Feb 17', count: 4 },
  { day: 'Feb 18', count: 6 }, { day: 'Feb 19', count: 7 }, { day: 'Feb 20', count: 5 }, { day: 'Feb 21', count: 8 },
  { day: 'Feb 24', count: 7 }, { day: 'Feb 25', count: 6 }, { day: 'Feb 26', count: 9 }, { day: 'Feb 27', count: 6 },
];

export const enrollmentProductMix = [
  { name: 'Lease-to-Own', value: 82, pct: 62.1, color: '#3b82f6' },
  { name: 'Retail Contract', value: 50, pct: 37.9, color: '#10b981' },
];

export const enrollmentsByState = [
  { state: 'Texas', count: 38 }, { state: 'Florida', count: 32 }, { state: 'California', count: 15 },
  { state: 'Georgia', count: 12 }, { state: 'Arizona', count: 11 }, { state: 'Ohio', count: 8 },
  { state: 'North Carolina', count: 7 }, { state: 'Tennessee', count: 6 }, { state: 'Nevada', count: 5 },
  { state: 'Illinois', count: 4 },
];

export const enrollmentsByIndustry = [
  { industry: 'Auto - Repair', count: 82, color: '#3b82f6' },
  { industry: 'Auto - Total Car Care', count: 23, color: '#60a5fa' },
  { industry: 'Pets', count: 6, color: '#10b981' },
  { industry: 'Auto - Tires', count: 6, color: '#93c5fd' },
  { industry: 'Auto - Transmission', count: 4, color: '#a5b4fc' },
  { industry: 'Furniture', count: 8, color: '#f59e0b' },
  { industry: 'Jewelry', count: 5, color: '#8b5cf6' },
  { industry: 'Home Services', count: 4, color: '#14b8a6' },
  { industry: 'Electronics', count: 3, color: '#f97316' },
];

export const territoryPerformance = [
  { territory: 'RIC-2', branchCount: 154, activeBranches: 59, inactiveBranches: 95, preAvgMonthly: 276054, postRunRate: 151174, deltaPct: -45.2, totalEnrollments: 52, osrs: ['Jared Midkiff', 'Yemaira Hernandez'] },
  { territory: 'RIC-4', branchCount: 120, activeBranches: 54, inactiveBranches: 66, preAvgMonthly: 218400, postRunRate: 142460, deltaPct: -34.8, totalEnrollments: 44, osrs: ['Sara Porter', 'Omar Corona'] },
  { territory: 'RIC-6', branchCount: 98, activeBranches: 42, inactiveBranches: 56, preAvgMonthly: 184200, postRunRate: 128940, deltaPct: -30.0, totalEnrollments: 38, osrs: ['Stephanie Whitlock', 'DeLon Phoenix'] },
  { territory: 'RIC-9', branchCount: 88, activeBranches: 38, inactiveBranches: 50, preAvgMonthly: 162800, postRunRate: 105820, deltaPct: -35.0, totalEnrollments: 37, osrs: ['Phillip Mason', 'Eric Henderson'] },
];

export const topProducingMerchants = [
  { rank: 1, name: 'Puppies For Less Skypointe', osr: 'DeLon Phoenix', funded: 28525, fundedApps: 10, totalApps: 24, conversionRate: 41.7 },
  { rank: 2, name: 'Family Auto & Towing', osr: 'Sara Porter', funded: 16881, fundedApps: 7, totalApps: 12, conversionRate: 58.3 },
  { rank: 3, name: '1PlusPhoneFix', osr: 'Omar Corona', funded: 16761, fundedApps: 4, totalApps: 31, conversionRate: 12.9 },
  { rank: 4, name: 'The Auto Garage', osr: 'Jared Midkiff', funded: 11000, fundedApps: 3, totalApps: 4, conversionRate: 75.0 },
  { rank: 5, name: 'Meineke - Chester', osr: 'Eric Henderson', funded: 9179, fundedApps: 6, totalApps: 13, conversionRate: 46.2 },
  { rank: 6, name: 'Elite Tire & Auto', osr: 'Jared Midkiff', funded: 8450, fundedApps: 5, totalApps: 10, conversionRate: 50.0 },
  { rank: 7, name: 'Paws & Claws Animal Hospital', osr: 'Phillip Mason', funded: 7820, fundedApps: 4, totalApps: 8, conversionRate: 50.0 },
  { rank: 8, name: 'Sunrise Automotive', osr: 'Stephanie Whitlock', funded: 6940, fundedApps: 3, totalApps: 7, conversionRate: 42.9 },
  { rank: 9, name: 'Diamond Jewelers Express', osr: 'Yemaira Hernandez', funded: 6200, fundedApps: 2, totalApps: 6, conversionRate: 33.3 },
  { rank: 10, name: 'ComfortZone Furniture', osr: 'Sara Porter', funded: 5800, fundedApps: 3, totalApps: 9, conversionRate: 33.3 },
];

export const productionFunnel = [
  { stage: 'Active Merchants', value: 70, pct: 100, color: '#3b82f6' },
  { stage: 'Total Applications', value: 390, pct: 85, color: '#10b981' },
  { stage: 'Funded Applications', value: 81, pct: 45, color: '#f59e0b' },
  { stage: 'Producing Merchants', value: 35, pct: 30, color: '#8b5cf6' },
];

// --- Custom Reports: Templates & Saved Reports ---
export const reportTemplates = [
  { id: 'tpl-top-performers', name: 'Top Performers by Volume', description: 'Merchants ranked by funded volume MTD with key performance metrics.', icon: 'trophy', dataSource: 'merchants' as const, filters: {} as Record<string, string[]>, metrics: ['volumeMTD', 'volumeYTD', 'dealsMTD', 'approvalRate', 'fundingRate'], sortBy: 'volumeMTD', sortDir: 'desc' as const, lastRun: '2026-03-02T14:30:00' },
  { id: 'tpl-at-risk', name: 'At-Risk Merchants', description: 'Merchants with elevated delinquency rates — flagging risk indicators.', icon: 'alertTriangle', dataSource: 'merchants' as const, filters: {} as Record<string, string[]>, metrics: ['volumeMTD', 'delinquencyRate', 'chargebackRate', 'fpdRate', 'approvalRate'], sortBy: 'delinquencyRate', sortDir: 'desc' as const, lastRun: '2026-03-01T09:15:00' },
  { id: 'tpl-territory', name: 'Territory Comparison', description: 'All territories side-by-side with branches, run rates, and delta performance.', icon: 'map', dataSource: 'territories' as const, filters: {} as Record<string, string[]>, metrics: ['branchCount', 'activeBranches', 'inactiveBranches', 'preAvgMonthly', 'postRunRate', 'deltaPct'], sortBy: 'territory', sortDir: 'asc' as const, lastRun: '2026-02-28T16:45:00' },
  { id: 'tpl-rep-leaderboard', name: 'Rep Leaderboard', description: 'Sales reps ranked by funded deals, volume, and activation rates.', icon: 'users', dataSource: 'reps' as const, filters: {} as Record<string, string[]>, metrics: ['merchants', 'fundedMTD', 'volumeMTD', 'enrollmentsMTD', 'activationRate'], sortBy: 'fundedMTD', sortDir: 'desc' as const, lastRun: '2026-03-02T11:00:00' },
  { id: 'tpl-industry', name: 'Industry Breakdown', description: 'Merchant performance grouped by industry vertical with averages.', icon: 'pieChart', dataSource: 'merchants' as const, filters: {} as Record<string, string[]>, metrics: ['volumeMTD', 'dealsMTD', 'approvalRate', 'delinquencyRate', 'fundingRate'], sortBy: 'volumeMTD', sortDir: 'desc' as const, groupBy: 'industry' as const, lastRun: '2026-02-27T13:20:00' },
  { id: 'tpl-enrollment', name: 'Enrollment Pipeline', description: 'Enrollment rep activity with funded volume, apps, and conversion metrics.', icon: 'rocket', dataSource: 'reps' as const, filters: {} as Record<string, string[]>, metrics: ['merchants', 'fundedMTD', 'volumeMTD', 'enrollmentsMTD', 'activationRate'], sortBy: 'enrollmentsMTD', sortDir: 'desc' as const, lastRun: '2026-03-01T10:30:00' },
  { id: 'tpl-campaign-performance', name: 'Campaign Performance', description: 'All email campaigns ranked by open rate with engagement and revenue metrics.', icon: 'trophy', dataSource: 'campaigns' as const, filters: {} as Record<string, string[]>, metrics: ['sent', 'openRate', 'clickRate', 'revenue', 'unsubscribed'], sortBy: 'openRate', sortDir: 'desc' as const, lastRun: '2026-03-03T09:00:00' },
  { id: 'tpl-top-pages', name: 'Top Pages by Traffic', description: 'Website pages ranked by views with bounce rate and conversion data.', icon: 'pieChart', dataSource: 'pages' as const, filters: {} as Record<string, string[]>, metrics: ['views', 'uniqueViews', 'bounceRate', 'convRate', 'avgTimeOnPage'], sortBy: 'views', sortDir: 'desc' as const, lastRun: '2026-03-02T15:00:00' },
  { id: 'tpl-app-screens', name: 'App Screen Analytics', description: 'Mobile app screens ranked by usage with crash rates and user satisfaction.', icon: 'rocket', dataSource: 'screens' as const, filters: {} as Record<string, string[]>, metrics: ['views', 'sessions', 'avgDuration', 'crashRate', 'userRating'], sortBy: 'views', sortDir: 'desc' as const, lastRun: '2026-03-02T12:00:00' },
];

export const savedReports = [
  { id: 'saved-1', name: 'Southeast Auto Merchants Q1', createdDate: '2026-02-15', dataSource: 'merchants' as const, filters: { territory: ['Southeast'], industry: ['Auto'] } as Record<string, string[]>, metrics: ['volumeMTD', 'volumeYTD', 'dealsMTD', 'approvalRate', 'delinquencyRate'], sortBy: 'volumeMTD', sortDir: 'desc' as const, filterSummary: 'Territory: Southeast · Industry: Auto' },
  { id: 'saved-2', name: 'High Delinquency Watch', createdDate: '2026-02-20', dataSource: 'merchants' as const, filters: {} as Record<string, string[]>, metrics: ['volumeMTD', 'delinquencyRate', 'chargebackRate', 'fpdRate'], sortBy: 'delinquencyRate', sortDir: 'desc' as const, filterSummary: 'All merchants · Sorted by delinquency rate' },
  { id: 'saved-3', name: 'RIC-2 Rep Performance', createdDate: '2026-02-25', dataSource: 'reps' as const, filters: { territory: ['RIC-2'] } as Record<string, string[]>, metrics: ['merchants', 'fundedMTD', 'volumeMTD', 'activationRate'], sortBy: 'fundedMTD', sortDir: 'desc' as const, filterSummary: 'Territory: RIC-2' },
];

// --- Branch / Territory Detail Data ---
export type BranchDetail = {
  territory: string;
  region: string;
  manager: string;
  branchCount: number;
  activeBranches: number;
  inactiveBranches: number;
  preAvgMonthly: number;
  postRunRate: number;
  deltaPct: number;
  totalEnrollments: number;
  osrs: string[];
  topBranches: { name: string; city: string; state: string; status: 'Active' | 'Inactive'; monthlyVolume: number; enrollments: number; activationDate: string }[];
  monthlyPerformance: { month: string; volume: number; enrollments: number }[];
  keyMetrics: { avgTicket: number; conversionRate: number; fundingRate: number; activeRate: number };
};

export const branchDetails: Record<string, BranchDetail> = {
  'RIC-2': {
    territory: 'RIC-2', region: 'Southeast', manager: 'Regional VP — Brian Foster',
    branchCount: 154, activeBranches: 59, inactiveBranches: 95,
    preAvgMonthly: 276054, postRunRate: 151174, deltaPct: -45.2, totalEnrollments: 52,
    osrs: ['Jared Midkiff', 'Yemaira Hernandez'],
    topBranches: [
      { name: 'Houston Central', city: 'Houston', state: 'TX', status: 'Active', monthlyVolume: 28400, enrollments: 8, activationDate: '2024-06-15' },
      { name: 'Atlanta Midtown', city: 'Atlanta', state: 'GA', status: 'Active', monthlyVolume: 22100, enrollments: 6, activationDate: '2024-07-02' },
      { name: 'Miami Beach', city: 'Miami', state: 'FL', status: 'Active', monthlyVolume: 19800, enrollments: 5, activationDate: '2024-08-10' },
      { name: 'Dallas North', city: 'Dallas', state: 'TX', status: 'Active', monthlyVolume: 17200, enrollments: 4, activationDate: '2024-09-22' },
      { name: 'Tampa Bay', city: 'Tampa', state: 'FL', status: 'Inactive', monthlyVolume: 0, enrollments: 0, activationDate: '2024-10-05' },
    ],
    monthlyPerformance: [
      { month: 'Sep', volume: 142000, enrollments: 7 }, { month: 'Oct', volume: 148000, enrollments: 8 },
      { month: 'Nov', volume: 145000, enrollments: 9 }, { month: 'Dec', volume: 150000, enrollments: 10 },
      { month: 'Jan', volume: 151000, enrollments: 9 }, { month: 'Feb', volume: 151174, enrollments: 9 },
    ],
    keyMetrics: { avgTicket: 2042, conversionRate: 20.8, fundingRate: 61.3, activeRate: 38.3 },
  },
  'RIC-4': {
    territory: 'RIC-4', region: 'West Coast', manager: 'Regional VP — Karen Liu',
    branchCount: 120, activeBranches: 54, inactiveBranches: 66,
    preAvgMonthly: 218400, postRunRate: 142460, deltaPct: -34.8, totalEnrollments: 44,
    osrs: ['Sara Porter', 'Omar Corona'],
    topBranches: [
      { name: 'Los Angeles West', city: 'Los Angeles', state: 'CA', status: 'Active', monthlyVolume: 24600, enrollments: 7, activationDate: '2024-05-20' },
      { name: 'San Diego South', city: 'San Diego', state: 'CA', status: 'Active', monthlyVolume: 21200, enrollments: 5, activationDate: '2024-06-12' },
      { name: 'Las Vegas Strip', city: 'Las Vegas', state: 'NV', status: 'Active', monthlyVolume: 18900, enrollments: 4, activationDate: '2024-07-18' },
      { name: 'Phoenix Metro', city: 'Phoenix', state: 'AZ', status: 'Active', monthlyVolume: 16400, enrollments: 4, activationDate: '2024-08-25' },
      { name: 'Portland NW', city: 'Portland', state: 'OR', status: 'Inactive', monthlyVolume: 0, enrollments: 0, activationDate: '2024-09-15' },
    ],
    monthlyPerformance: [
      { month: 'Sep', volume: 128000, enrollments: 6 }, { month: 'Oct', volume: 132000, enrollments: 7 },
      { month: 'Nov', volume: 136000, enrollments: 7 }, { month: 'Dec', volume: 139000, enrollments: 8 },
      { month: 'Jan', volume: 141000, enrollments: 8 }, { month: 'Feb', volume: 142460, enrollments: 8 },
    ],
    keyMetrics: { avgTicket: 1886, conversionRate: 22.4, fundingRate: 64.8, activeRate: 45.0 },
  },
  'RIC-6': {
    territory: 'RIC-6', region: 'Central', manager: 'Regional VP — Tom Richardson',
    branchCount: 98, activeBranches: 42, inactiveBranches: 56,
    preAvgMonthly: 184200, postRunRate: 128940, deltaPct: -30.0, totalEnrollments: 38,
    osrs: ['Stephanie Whitlock', 'DeLon Phoenix'],
    topBranches: [
      { name: 'Denver Downtown', city: 'Denver', state: 'CO', status: 'Active', monthlyVolume: 20800, enrollments: 6, activationDate: '2024-04-08' },
      { name: 'Nashville East', city: 'Nashville', state: 'TN', status: 'Active', monthlyVolume: 18200, enrollments: 5, activationDate: '2024-05-14' },
      { name: 'Charlotte South', city: 'Charlotte', state: 'NC', status: 'Active', monthlyVolume: 15600, enrollments: 4, activationDate: '2024-06-30' },
      { name: 'Kansas City', city: 'Kansas City', state: 'MO', status: 'Active', monthlyVolume: 14200, enrollments: 3, activationDate: '2024-08-02' },
      { name: 'Memphis Central', city: 'Memphis', state: 'TN', status: 'Inactive', monthlyVolume: 0, enrollments: 0, activationDate: '2024-09-10' },
    ],
    monthlyPerformance: [
      { month: 'Sep', volume: 118000, enrollments: 5 }, { month: 'Oct', volume: 122000, enrollments: 6 },
      { month: 'Nov', volume: 124000, enrollments: 6 }, { month: 'Dec', volume: 126000, enrollments: 7 },
      { month: 'Jan', volume: 128000, enrollments: 7 }, { month: 'Feb', volume: 128940, enrollments: 7 },
    ],
    keyMetrics: { avgTicket: 1724, conversionRate: 24.1, fundingRate: 66.2, activeRate: 42.9 },
  },
  'RIC-9': {
    territory: 'RIC-9', region: 'Northeast', manager: 'Regional VP — Angela Simmons',
    branchCount: 88, activeBranches: 38, inactiveBranches: 50,
    preAvgMonthly: 162800, postRunRate: 105820, deltaPct: -35.0, totalEnrollments: 37,
    osrs: ['Phillip Mason', 'Eric Henderson'],
    topBranches: [
      { name: 'New York Midtown', city: 'New York', state: 'NY', status: 'Active', monthlyVolume: 19400, enrollments: 5, activationDate: '2024-03-22' },
      { name: 'Chicago Loop', city: 'Chicago', state: 'IL', status: 'Active', monthlyVolume: 16800, enrollments: 4, activationDate: '2024-04-15' },
      { name: 'Columbus West', city: 'Columbus', state: 'OH', status: 'Active', monthlyVolume: 13200, enrollments: 4, activationDate: '2024-06-08' },
      { name: 'Philadelphia Center', city: 'Philadelphia', state: 'PA', status: 'Active', monthlyVolume: 11600, enrollments: 3, activationDate: '2024-07-20' },
      { name: 'Boston Back Bay', city: 'Boston', state: 'MA', status: 'Inactive', monthlyVolume: 0, enrollments: 0, activationDate: '2024-08-30' },
    ],
    monthlyPerformance: [
      { month: 'Sep', volume: 96000, enrollments: 5 }, { month: 'Oct', volume: 98000, enrollments: 6 },
      { month: 'Nov', volume: 100000, enrollments: 6 }, { month: 'Dec', volume: 102000, enrollments: 6 },
      { month: 'Jan', volume: 104000, enrollments: 7 }, { month: 'Feb', volume: 105820, enrollments: 7 },
    ],
    keyMetrics: { avgTicket: 1658, conversionRate: 18.6, fundingRate: 58.4, activeRate: 43.2 },
  },
};

// --- Previous Period Comparison Data ---
// Used by Period-over-Period comparison feature in charts

export const prevSaveRateTrend = [
  { month: 'Aug', financeSave: 72, ltoSave: 58, target: 50 },
  { month: 'Sep', financeSave: 68, ltoSave: 55, target: 50 },
  { month: 'Oct', financeSave: 65, ltoSave: 52, target: 50 },
  { month: 'Nov', financeSave: 60, ltoSave: 48, target: 50 },
  { month: 'Dec', financeSave: 55, ltoSave: 42, target: 50 },
  { month: 'Jan', financeSave: 50, ltoSave: 38, target: 50 },
];

export const prevMonthlyFundingTrend = [
  { month: 'Aug', finance: 880, lto: 560 },
  { month: 'Sep', finance: 920, lto: 600 },
  { month: 'Oct', finance: 950, lto: 640 },
  { month: 'Nov', finance: 980, lto: 660 },
  { month: 'Dec', finance: 1020, lto: 690 },
  { month: 'Jan', finance: 1050, lto: 710 },
];

export const prevSaveVsRollTrend = [
  { month: 'Aug', saveRate: 74, rollRate: 10 },
  { month: 'Sep', saveRate: 70, rollRate: 11 },
  { month: 'Oct', saveRate: 66, rollRate: 13 },
  { month: 'Nov', saveRate: 62, rollRate: 15 },
  { month: 'Dec', saveRate: 55, rollRate: 18 },
  { month: 'Jan', saveRate: 50, rollRate: 20 },
];

// ═══════════════════════════════════════════════════════════════
// ── MyEasyPay Mobile App Data ──
// ═══════════════════════════════════════════════════════════════

export const mobileAppData = {
  combined: {
    totalDownloads: 184200,
    totalDownloadsTrend: 12.4,
    monthlyDownloads: 8420,
    monthlyDownloadsTrend: 6.8,
    dau: 28400,
    dauTrend: 8.2,
    mau: 94600,
    mauTrend: 5.1,
    retentionRate: 68,
    retentionTrend: 2.3,
    avgSessionDuration: '4m 32s',
    avgSessionSeconds: 272,
    sessionTrend: 3.1,
    crashRate: 0.8,
    crashTrend: -12,
    pushOptIn: 72,
    pushTrend: 1.8,
    avgRating: 4.6,
    ratingTrend: 0.1,
    reviewCount: 3240,
  },
  ios: {
    downloads: 112400,
    downloadsTrend: 14.2,
    dau: 18200,
    mau: 61500,
    avgRating: 4.7,
    reviewCount: 1840,
    crashRate: 0.6,
    retentionRate: 71,
    version: '3.2.1',
  },
  android: {
    downloads: 71800,
    downloadsTrend: 9.8,
    dau: 10200,
    mau: 33100,
    avgRating: 4.4,
    reviewCount: 1400,
    crashRate: 1.1,
    retentionRate: 63,
    version: '3.2.0',
  },
};

export const mobileDownloadsTrend = [
  { month: 'Aug', ios: 5200, android: 3100, total: 8300 },
  { month: 'Sep', ios: 5600, android: 3400, total: 9000 },
  { month: 'Oct', ios: 6100, android: 3600, total: 9700 },
  { month: 'Nov', ios: 5800, android: 3300, total: 9100 },
  { month: 'Dec', ios: 6400, android: 3800, total: 10200 },
  { month: 'Jan', ios: 5500, android: 2920, total: 8420 },
];

export const mobileDauTrend = [
  { month: 'Aug', ios: 14800, android: 8200, total: 23000 },
  { month: 'Sep', ios: 15400, android: 8600, total: 24000 },
  { month: 'Oct', ios: 16100, android: 9000, total: 25100 },
  { month: 'Nov', ios: 16800, android: 9400, total: 26200 },
  { month: 'Dec', ios: 17500, android: 9800, total: 27300 },
  { month: 'Jan', ios: 18200, android: 10200, total: 28400 },
];

export const mobilePlatformSplit = [
  { name: 'iOS', value: 61, fill: '#3b82f6' },
  { name: 'Android', value: 39, fill: '#10b981' },
];

export const mobileScreenViews = [
  { screen: 'Dashboard', views: 42300 },
  { screen: 'Payments', views: 38100 },
  { screen: 'Account', views: 24600 },
  { screen: 'Statements', views: 18200 },
  { screen: 'Support', views: 12400 },
];

// ═══════════════════════════════════════════════════════════════
// ── Website Traffic Data ──
// ═══════════════════════════════════════════════════════════════

export const websiteTrafficData = {
  sessions: 126400,
  sessionsTrend: 9.2,
  uniqueVisitors: 84200,
  uniqueVisitorsTrend: 7.8,
  pageViews: 412000,
  pageViewsTrend: 11.3,
  bounceRate: 38.4,
  bounceRateTrend: -2.1,
  avgSessionDuration: '3m 18s',
  avgSessionSeconds: 198,
  sessionDurationTrend: 4.6,
  conversionRate: 3.2,
  conversionTrend: 0.8,
  goalCompletions: 4045,
  goalTrend: 12.4,
  pagesPerSession: 3.26,
};

export const websiteSessionsTrend = [
  { month: 'Aug', sessions: 98200, visitors: 65400 },
  { month: 'Sep', sessions: 104600, visitors: 70100 },
  { month: 'Oct', sessions: 112400, visitors: 74800 },
  { month: 'Nov', sessions: 108200, visitors: 72400 },
  { month: 'Dec', sessions: 118600, visitors: 79200 },
  { month: 'Jan', sessions: 126400, visitors: 84200 },
];

export const websiteTrafficSources = [
  { name: 'Organic Search', value: 42, fill: '#10b981' },
  { name: 'Direct', value: 24, fill: '#3b82f6' },
  { name: 'Referral', value: 16, fill: '#f59e0b' },
  { name: 'Paid Search', value: 12, fill: '#8b5cf6' },
  { name: 'Social', value: 6, fill: '#ec4899' },
];

export const websiteDeviceBreakdown = [
  { device: 'Desktop', sessions: 68, bounceRate: 32 },
  { device: 'Mobile', sessions: 26, bounceRate: 48 },
  { device: 'Tablet', sessions: 6, bounceRate: 36 },
];

export const websiteTopPages = [
  { page: '/apply', views: 48200, convRate: 8.4 },
  { page: '/login', views: 42100, convRate: 62.1 },
  { page: '/products', views: 36400, convRate: 4.2 },
  { page: '/about', views: 28600, convRate: 1.8 },
  { page: '/support', views: 22400, convRate: 3.1 },
];

export const websiteBounceRateTrend = [
  { month: 'Aug', bounceRate: 42.1, target: 35 },
  { month: 'Sep', bounceRate: 41.2, target: 35 },
  { month: 'Oct', bounceRate: 40.6, target: 35 },
  { month: 'Nov', bounceRate: 39.8, target: 35 },
  { month: 'Dec', bounceRate: 39.2, target: 35 },
  { month: 'Jan', bounceRate: 38.4, target: 35 },
];

// ═══════════════════════════════════════════════════════════════
// ── Outbound Marketing Data (Mailchimp) ──
// ═══════════════════════════════════════════════════════════════

export const outboundMarketingData = {
  totalCampaigns: 24,
  campaignsTrend: 4,
  emailsSent: 186400,
  emailsSentTrend: 8.6,
  avgOpenRate: 34.2,
  openRateTrend: 2.4,
  avgClickRate: 4.8,
  clickRateTrend: 0.6,
  unsubscribeRate: 0.3,
  unsubscribeTrend: -0.1,
  bounceRate: 1.2,
  bounceTrend: -0.2,
  listSize: 42800,
  listGrowthRate: 3.4,
  revenueAttributed: 284000,
  revenueTrend: 14.2,
};

export const marketingCampaigns = [
  { name: 'January Newsletter', sent: 42800, opened: 15408, clicked: 2140, date: 'Jan 15', status: 'sent' as const, openRate: 36.0, clickRate: 5.0 },
  { name: 'New Year Promo', sent: 42800, opened: 17120, clicked: 3424, date: 'Jan 2', status: 'sent' as const, openRate: 40.0, clickRate: 8.0 },
  { name: 'Holiday Special', sent: 41200, opened: 14420, clicked: 2060, date: 'Dec 18', status: 'sent' as const, openRate: 35.0, clickRate: 5.0 },
  { name: 'Product Update', sent: 42000, opened: 13440, clicked: 1680, date: 'Dec 5', status: 'sent' as const, openRate: 32.0, clickRate: 4.0 },
  { name: 'Black Friday', sent: 41800, opened: 18810, clicked: 4180, date: 'Nov 24', status: 'sent' as const, openRate: 45.0, clickRate: 10.0 },
  { name: 'Nov Newsletter', sent: 40600, opened: 13398, clicked: 1624, date: 'Nov 12', status: 'sent' as const, openRate: 33.0, clickRate: 4.0 },
];

export const marketingOpenClickTrend = [
  { month: 'Aug', openRate: 30.2, clickRate: 3.8 },
  { month: 'Sep', openRate: 31.4, clickRate: 4.0 },
  { month: 'Oct', openRate: 32.8, clickRate: 4.2 },
  { month: 'Nov', openRate: 33.6, clickRate: 4.5 },
  { month: 'Dec', openRate: 33.8, clickRate: 4.6 },
  { month: 'Jan', openRate: 34.2, clickRate: 4.8 },
];

export const marketingListGrowth = [
  { month: 'Aug', subscribers: 38200, newSubs: 1400, unsubscribed: 180 },
  { month: 'Sep', subscribers: 39400, newSubs: 1380, unsubscribed: 160 },
  { month: 'Oct', subscribers: 40500, newSubs: 1320, unsubscribed: 200 },
  { month: 'Nov', subscribers: 41400, newSubs: 1120, unsubscribed: 220 },
  { month: 'Dec', subscribers: 42100, newSubs: 940, unsubscribed: 240 },
  { month: 'Jan', subscribers: 42800, newSubs: 960, unsubscribed: 260 },
];

// ═══════════════════════════════════════════════════════════════
// ── Custom Reports — Expanded Record-Level Data ──
// ═══════════════════════════════════════════════════════════════

// ── Email Campaigns (expanded for Custom Reports) ──
export const campaignRecords = [
  { name: 'January Newsletter', type: 'Newsletter', audience: 'All Subscribers', sent: 42800, opened: 15408, clicked: 2140, bounced: 514, unsubscribed: 86, openRate: 36.0, clickRate: 5.0, bounceRate: 1.2, revenue: 18200, date: '2026-01-15', month: 'Jan', status: 'sent' },
  { name: 'New Year Promo', type: 'Promotional', audience: 'Active Customers', sent: 42800, opened: 17120, clicked: 3424, bounced: 428, unsubscribed: 64, openRate: 40.0, clickRate: 8.0, bounceRate: 1.0, revenue: 42600, date: '2026-01-02', month: 'Jan', status: 'sent' },
  { name: 'Holiday Special', type: 'Promotional', audience: 'All Subscribers', sent: 41200, opened: 14420, clicked: 2060, bounced: 618, unsubscribed: 102, openRate: 35.0, clickRate: 5.0, bounceRate: 1.5, revenue: 36800, date: '2025-12-18', month: 'Dec', status: 'sent' },
  { name: 'Product Update', type: 'Newsletter', audience: 'Active Customers', sent: 42000, opened: 13440, clicked: 1680, bounced: 504, unsubscribed: 84, openRate: 32.0, clickRate: 4.0, bounceRate: 1.2, revenue: 8400, date: '2025-12-05', month: 'Dec', status: 'sent' },
  { name: 'Black Friday', type: 'Promotional', audience: 'All Subscribers', sent: 41800, opened: 18810, clicked: 4180, bounced: 376, unsubscribed: 42, openRate: 45.0, clickRate: 10.0, bounceRate: 0.9, revenue: 68400, date: '2025-11-24', month: 'Nov', status: 'sent' },
  { name: 'Nov Newsletter', type: 'Newsletter', audience: 'All Subscribers', sent: 40600, opened: 13398, clicked: 1624, bounced: 528, unsubscribed: 98, openRate: 33.0, clickRate: 4.0, bounceRate: 1.3, revenue: 6200, date: '2025-11-12', month: 'Nov', status: 'sent' },
  { name: 'Fall Savings', type: 'Promotional', audience: 'Lapsed Customers', sent: 18400, opened: 5520, clicked: 920, bounced: 276, unsubscribed: 128, openRate: 30.0, clickRate: 5.0, bounceRate: 1.5, revenue: 14800, date: '2025-10-28', month: 'Oct', status: 'sent' },
  { name: 'Oct Newsletter', type: 'Newsletter', audience: 'All Subscribers', sent: 39800, opened: 13134, clicked: 1592, bounced: 478, unsubscribed: 80, openRate: 33.0, clickRate: 4.0, bounceRate: 1.2, revenue: 5800, date: '2025-10-15', month: 'Oct', status: 'sent' },
  { name: 'AutoPay Reminder', type: 'Transactional', audience: 'Non-AutoPay', sent: 12400, opened: 6200, clicked: 1860, bounced: 124, unsubscribed: 12, openRate: 50.0, clickRate: 15.0, bounceRate: 1.0, revenue: 0, date: '2025-10-10', month: 'Oct', status: 'sent' },
  { name: 'Sep Newsletter', type: 'Newsletter', audience: 'All Subscribers', sent: 39200, opened: 12544, clicked: 1568, bounced: 470, unsubscribed: 72, openRate: 32.0, clickRate: 4.0, bounceRate: 1.2, revenue: 5400, date: '2025-09-15', month: 'Sep', status: 'sent' },
  { name: 'Back to School', type: 'Promotional', audience: 'Active Customers', sent: 38600, opened: 13510, clicked: 2316, bounced: 386, unsubscribed: 58, openRate: 35.0, clickRate: 6.0, bounceRate: 1.0, revenue: 28200, date: '2025-09-05', month: 'Sep', status: 'sent' },
  { name: 'Payment Due Reminder', type: 'Transactional', audience: 'Past Due', sent: 8200, opened: 4920, clicked: 2460, bounced: 82, unsubscribed: 4, openRate: 60.0, clickRate: 30.0, bounceRate: 1.0, revenue: 0, date: '2025-08-28', month: 'Aug', status: 'sent' },
];

// ── Website Pages (expanded for Custom Reports) ──
export const websitePageRecords = [
  { page: '/apply', section: 'Conversion', views: 48200, uniqueViews: 38400, bounceRate: 22.4, avgTimeOnPage: 185, convRate: 8.4, device: 'All', source: 'Organic' },
  { page: '/login', section: 'Account', views: 42100, uniqueViews: 36800, bounceRate: 12.1, avgTimeOnPage: 42, convRate: 62.1, device: 'All', source: 'Direct' },
  { page: '/products', section: 'Marketing', views: 36400, uniqueViews: 28600, bounceRate: 34.2, avgTimeOnPage: 124, convRate: 4.2, device: 'All', source: 'Organic' },
  { page: '/about', section: 'Marketing', views: 28600, uniqueViews: 24200, bounceRate: 48.6, avgTimeOnPage: 96, convRate: 1.8, device: 'All', source: 'Organic' },
  { page: '/support', section: 'Service', views: 22400, uniqueViews: 18200, bounceRate: 28.4, avgTimeOnPage: 210, convRate: 3.1, device: 'All', source: 'Direct' },
  { page: '/faq', section: 'Service', views: 18600, uniqueViews: 15400, bounceRate: 42.8, avgTimeOnPage: 148, convRate: 1.2, device: 'All', source: 'Organic' },
  { page: '/payments', section: 'Account', views: 16200, uniqueViews: 14800, bounceRate: 15.2, avgTimeOnPage: 62, convRate: 48.2, device: 'All', source: 'Direct' },
  { page: '/account/settings', section: 'Account', views: 12400, uniqueViews: 11200, bounceRate: 18.6, avgTimeOnPage: 88, convRate: 22.4, device: 'All', source: 'Direct' },
  { page: '/blog', section: 'Marketing', views: 11800, uniqueViews: 9400, bounceRate: 56.2, avgTimeOnPage: 182, convRate: 0.8, device: 'All', source: 'Social' },
  { page: '/contact', section: 'Service', views: 9600, uniqueViews: 8200, bounceRate: 32.4, avgTimeOnPage: 74, convRate: 12.6, device: 'All', source: 'Organic' },
  { page: '/merchants', section: 'Marketing', views: 8400, uniqueViews: 7200, bounceRate: 38.4, avgTimeOnPage: 108, convRate: 3.8, device: 'All', source: 'Paid' },
  { page: '/rates', section: 'Marketing', views: 7200, uniqueViews: 6400, bounceRate: 30.2, avgTimeOnPage: 142, convRate: 5.6, device: 'All', source: 'Organic' },
];

// ── Mobile App Screens (expanded for Custom Reports) ──
export const mobileScreenRecords = [
  { screen: 'Dashboard', platform: 'Both', views: 42300, sessions: 38200, avgDuration: 45, crashRate: 0.02, userRating: 4.7, category: 'Core' },
  { screen: 'Payments', platform: 'Both', views: 38100, sessions: 34800, avgDuration: 62, crashRate: 0.04, userRating: 4.5, category: 'Core' },
  { screen: 'Account', platform: 'Both', views: 24600, sessions: 22100, avgDuration: 38, crashRate: 0.01, userRating: 4.6, category: 'Core' },
  { screen: 'Statements', platform: 'Both', views: 18200, sessions: 16400, avgDuration: 84, crashRate: 0.03, userRating: 4.4, category: 'Financial' },
  { screen: 'Support', platform: 'Both', views: 12400, sessions: 11200, avgDuration: 120, crashRate: 0.05, userRating: 4.2, category: 'Service' },
  { screen: 'AutoPay Setup', platform: 'Both', views: 9800, sessions: 8600, avgDuration: 95, crashRate: 0.06, userRating: 4.3, category: 'Financial' },
  { screen: 'Notifications', platform: 'Both', views: 8400, sessions: 7800, avgDuration: 22, crashRate: 0.01, userRating: 4.5, category: 'Core' },
  { screen: 'Profile', platform: 'Both', views: 7200, sessions: 6400, avgDuration: 48, crashRate: 0.02, userRating: 4.6, category: 'Core' },
  { screen: 'Documents', platform: 'Both', views: 5600, sessions: 4800, avgDuration: 72, crashRate: 0.08, userRating: 4.1, category: 'Financial' },
  { screen: 'Chat Support', platform: 'Both', views: 4200, sessions: 3800, avgDuration: 180, crashRate: 0.12, userRating: 3.9, category: 'Service' },
  { screen: 'Calculator', platform: 'iOS', views: 3400, sessions: 2800, avgDuration: 56, crashRate: 0.02, userRating: 4.8, category: 'Tools' },
  { screen: 'Referrals', platform: 'Both', views: 2800, sessions: 2400, avgDuration: 34, crashRate: 0.03, userRating: 4.4, category: 'Growth' },
];
