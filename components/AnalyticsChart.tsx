'use client';

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

// Response Time Comparison Data
const responseTimeData = [
  { hour: '00:00', manual: 12.5, ai: 8.2 },
  { hour: '04:00', manual: 11.8, ai: 7.9 },
  { hour: '08:00', manual: 13.2, ai: 8.5 },
  { hour: '12:00', manual: 14.1, ai: 9.1 },
  { hour: '16:00', manual: 13.5, ai: 8.8 },
  { hour: '20:00', manual: 12.9, ai: 8.3 },
];

// Accident Time Distribution
const accidentTimeData = [
  { name: 'Peak Hours', value: 38 },
  { name: 'Off-Peak', value: 27 },
  { name: 'Night Hours', value: 22 },
  { name: 'Early Morning', value: 13 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--status-stable))'];

export function ResponseTimeChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Response Time Comparison (Last 24h)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={responseTimeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
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
            dataKey="manual"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            name="Manual Routing"
          />
          <Line
            type="monotone"
            dataKey="ai"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            name="AI Optimized"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 p-4 bg-background/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Average Improvement:</span> 4.2 minutes
          faster with AI optimization
        </p>
      </div>
    </div>
  );
}

export function AccidentTimeChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Accident Distribution by Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={accidentTimeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {accidentTimeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
