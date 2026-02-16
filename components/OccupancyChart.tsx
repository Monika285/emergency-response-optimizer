'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { time: 'Now', current: 42, predicted: 42 },
  { time: '+1h', current: 52, predicted: 58 },
  { time: '+2h', current: 65, predicted: 72 },
  { time: '+3h', current: 78, predicted: 84 },
  { time: '+4h', current: 88, predicted: 91 },
  { time: '+5h', current: 92, predicted: 95 },
  { time: '+6h', current: 95, predicted: 98 },
];

export function OccupancyChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Bed Occupancy Forecast (Next 6 Hours)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="current"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            activeDot={{ r: 6 }}
            name="Current Occupancy"
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: 'hsl(var(--secondary))', r: 4 }}
            activeDot={{ r: 6 }}
            name="Predicted (with accidents)"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 p-4 bg-background/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Peak occupancy:</span> +6 hours at 98%
          capacity. Consider redirect protocols.
        </p>
      </div>
    </div>
  );
}
