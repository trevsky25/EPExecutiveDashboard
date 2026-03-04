# EasyPay Executive Dashboard

A comprehensive executive analytics console built for EasyPay's leadership and sales teams. This dashboard provides real-time visibility into portfolio health, sales performance, collections metrics, credit risk, and merchant operations across both Finance (RIC) and Lease-to-Own (LTO) product lines.

Built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, **Recharts**, and **TypeScript**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Dashboard Pages](#dashboard-pages)
- [Key Components](#key-components)
- [Data Layer](#data-layer)
- [Utilities](#utilities)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Design System](#design-system)

---

## Features

- **9 dashboard pages** covering every business unit (Executive Summary, Sales, Originations, Merchant Services, Portfolio Health, Credit & Risk, Collections, Customer Care, Custom Reports)
- **Global Search (Cmd+K)** command palette to instantly find merchants, reps, territories, and pages
- **Merchant Profile Panels** &mdash; click any merchant name across the dashboard to open a detailed slide-over with KPIs, volume trends, risk indicators, and activity history
- **Territory/Branch Profiles** &mdash; click any territory name to view branch-level detail with performance metrics
- **Custom Report Builder** with configurable data sources, on-demand filter picklist (category, date range, numeric range, activity), column selection, grouping, sorting, and CSV export
- **Merchant Comparison Tool** &mdash; side-by-side radar charts, trend lines, and metric highlights for up to 4 merchants
- **KPI Cards with Target Tracking** &mdash; progress bars showing MTD vs target with color-coded thresholds
- **KPI Detail Modals** &mdash; click any KPI card to see 6-month history charts, breakdowns, and insights
- **Date Range Filtering** &mdash; MTD, QTD, YTD, and custom date range controls that filter charts and metrics
- **CSV Export** &mdash; one-click export for any page with formatted headers and data
- **Responsive Layout** &mdash; collapsible sidebar, horizontal tab scrolling, mobile-friendly grid layouts
- **Smooth Animations** &mdash; fade-in transitions, slide-in panels, animated number counters

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library | [React 19](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) with CSS custom properties |
| Charts | [Recharts 3](https://recharts.org/) (Bar, Line, Area, Radar, Pie) |
| Icons | [Lucide React](https://lucide.dev/) |
| State | React hooks (useState, useEffect, useMemo, useCallback, useRef) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/trevsky25/EPExecutiveDashboard.git
cd EPExecutiveDashboard/ep-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint checks |

---

## Project Structure

```
ep-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (Inter font, metadata)
│   │   ├── page.tsx              # Main dashboard (tab routing, search, panels)
│   │   └── globals.css           # CSS custom properties & animations
│   │
│   ├── components/
│   │   ├── tabs/                 # Page-level tab components
│   │   │   ├── ExecutiveSummary.tsx
│   │   │   ├── Sales.tsx
│   │   │   ├── Originations.tsx
│   │   │   ├── MerchantServices.tsx
│   │   │   ├── PortfolioHealth.tsx
│   │   │   ├── CreditRisk.tsx
│   │   │   ├── Collections.tsx
│   │   │   ├── CustomerCare.tsx
│   │   │   └── CustomReports.tsx
│   │   │
│   │   ├── GlobalSearch.tsx         # Cmd+K command palette
│   │   ├── Sidebar.tsx              # Collapsible navigation sidebar
│   │   ├── KPICard.tsx              # Metric card with target progress
│   │   ├── KPIDetailModal.tsx       # Detailed KPI breakdown modal
│   │   ├── ChartCard.tsx            # Chart wrapper with badges
│   │   ├── MerchantProfilePanel.tsx # Merchant detail slide-over
│   │   ├── BranchProfilePanel.tsx   # Territory detail slide-over
│   │   ├── MerchantSearch.tsx       # Merchant search input
│   │   ├── DateRangeFilter.tsx      # MTD/QTD/YTD/Custom selector
│   │   ├── ExportButton.tsx         # CSV export trigger
│   │   ├── ConditionalCell.tsx      # Color-coded table cell
│   │   ├── Sparkline.tsx            # Inline trend chart
│   │   ├── StatusBadge.tsx          # Status indicator pill
│   │   ├── SubTabFilter.tsx         # Sub-tab navigation
│   │   ├── CustomTooltip.tsx        # Recharts tooltip styling
│   │   └── SkeletonCard.tsx         # Loading placeholder
│   │
│   ├── data/
│   │   └── mockData.ts             # Mock data layer (40+ exports)
│   │
│   ├── hooks/
│   │   └── useAnimatedNumber.ts    # Animated number counter hook
│   │
│   └── lib/
│       ├── chartDefaults.ts        # Shared Recharts configuration
│       ├── dateFilter.ts           # Date range filtering utilities
│       └── exportCSV.ts            # Zero-dependency CSV export
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## Dashboard Pages

### Executive Summary
Combined portfolio overview with KPI cards (Active Accounts, Current 0 DPD, At-Risk, Defaults, Save Rate, Collections MTD), target progress bars, Finance vs LTO side-by-side comparison, save rate trends, funding charts, delinquency waterfall, and collections channel mix.

### Sales
Four sub-tabs: **Sales Overview** (rep scorecard, top merchants by volume), **Enrollments** (enrollment credits, pace tracking, product mix), **Territory** (territory performance, OSR/ISR assignments), and **Production** (production funnel, top producing merchants, key observations).

### Originations
Funding trends, approval funnels, merchant onboarding tracking, and vertical mix analysis for new loan and lease originations.

### Merchant Services
Merchant partner growth, support volume trends, tier distribution (Platinum/Gold/Silver/Bronze), and top merchant issues.

### Portfolio Health
AutoPay vs manual delinquency comparison, auto-pay enrollment trends, and portfolio aging bucket analysis.

### Credit & Risk
Default rates by vintage, credit score distribution, first payment default (FPD) analysis by channel, and delinquency rates by industry.

### Collections
Collections MTD, save rates, roll rates, promise-to-pay tracking, right party contacts, CPH (calls per hour), and recovery performance.

### Customer Care
Customer care metrics, team CPH performance, call volume, and service level tracking.

### Custom Reports
Three sub-tabs: **Report Builder** (choose data source, add filters on-demand, select columns, group by, sort, chart, export), **Compare** (side-by-side merchant comparison with radar charts and trend lines for up to 4 merchants), and **Saved Reports** (templates and saved report configurations).

---

## Key Components

### GlobalSearch
Command palette triggered by `Cmd+K` / `Ctrl+K`. Searches across pages, merchants (by name, DBA, industry, city), sales reps (by name, territory), and territories. Results are grouped by category with keyboard navigation (arrow keys + Enter). Clicking a result navigates to the page or opens the relevant profile panel.

### KPICard
Reusable metric card with optional target progress bar. Supports trend indicators (up/down/flat), tooltips, subtitles, and click-to-open detail modals. The target progress bar is color-coded: green (on/above target), orange (80-99%), red (below 80%).

### MerchantProfilePanel / BranchProfilePanel
Portal-based slide-over panels that display detailed profiles. Merchant panels show contact info, performance KPIs, volume trend charts, risk indicators, and recent activity. Branch panels show territory-level metrics and branch details. Both support Escape key to close and body scroll locking.

### Custom Reports Filter System
"Add Filter" picklist pattern (similar to Notion/Linear) where users add filters on-demand from a categorized dropdown menu. Supports four filter types: multi-select (industry, state, territory), date range (enrolled date, funded date), numeric range (volume, approval rate), and single select (activity recency). Active filters display as removable pills.

---

## Data Layer

The dashboard currently uses a comprehensive mock data layer (`src/data/mockData.ts`) with 40+ exports covering all business metrics. This is designed to be swapped with real API calls when connecting to production data sources.

**Key data structures include:**
- **Executive metrics** &mdash; combined portfolio, Finance, LTO breakdowns
- **Time series** &mdash; monthly trends for charts
- **Merchant profiles** &mdash; 15 detailed profiles with full attributes
- **Rep scorecards** &mdash; 6 sales reps with territory assignments
- **Territory performance** &mdash; branch counts, pre/post metrics, delta tracking
- **KPI details** &mdash; history arrays, breakdowns, insights, targets

---

## Utilities

| Module | Description |
|--------|-------------|
| `lib/dateFilter.ts` | Period-based filtering (MTD, QTD, YTD) with custom date range support. Automatically slices time series data and adjusts KPI values. |
| `lib/exportCSV.ts` | Zero-dependency CSV export with proper escaping, quoting, and Unicode BOM support. Includes specialized merchant report export. |
| `lib/chartDefaults.ts` | Shared Recharts configuration for consistent chart styling &mdash; axis fonts, grid patterns, legend sizing, and color palette. |
| `hooks/useAnimatedNumber.ts` | Custom hook that smoothly animates numeric value changes using `requestAnimationFrame` with easing for KPI counters. |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open global search |
| `Escape` | Close search / Close profile panels |
| `Arrow Up/Down` | Navigate search results |
| `Enter` | Select search result |

---

## Design System

The dashboard uses a consistent design system defined through CSS custom properties:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-ep-green` | `#10b981` | Primary brand, positive metrics |
| `--color-ep-blue` | `#3b82f6` | Links, clickable elements |
| `--color-ep-purple` | `#8b5cf6` | Reports, filters, accents |
| `--color-ep-orange` | `#f59e0b` | Warnings, at-risk indicators |
| `--color-ep-red` | `#ef4444` | Alerts, negative metrics |
| `--color-ep-teal` | `#14b8a6` | Secondary charts, LTO product line |
| `--color-sidebar` | `#1a2332` | Sidebar background |

---

## License

This project is proprietary to EasyPay. All rights reserved.
