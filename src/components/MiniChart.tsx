'use client';

import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  ResponsiveContainer,
} from 'recharts';
import type { MiniChartType } from '@/lib/DashboardContext';

type MiniChartProps = {
  data: number[];
  type: MiniChartType;
  color?: string;
  height?: number;
};

export default function MiniChart({ data, type, color = '#10b981', height = 32 }: MiniChartProps) {
  if (type === 'none' || !data || data.length === 0) return null;

  const chartData = data.map((v, i) => ({ v, i }));
  const id = `mc-${color.replace('#', '')}`;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'sparkline' ? (
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        ) : type === 'bar' ? (
          <BarChart data={chartData} barCategoryGap="20%">
            <Bar dataKey="v" fill={color} opacity={0.7} radius={[2, 2, 0, 0]} isAnimationActive={false} />
          </BarChart>
        ) : (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#${id})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
