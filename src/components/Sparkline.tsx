'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

type SparklineProps = {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
};

export default function Sparkline({ data, color = '#10b981', width = 80, height = 24 }: SparklineProps) {
  const chartData = data.map((value, i) => ({ v: value }));

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
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
      </ResponsiveContainer>
    </div>
  );
}
