'use client';

import { AlertCircle, TrendingUp, Package } from 'lucide-react';

interface Alert {
  id: string;
  type: 'overload' | 'prediction' | 'resource';
  title: string;
  message: string;
  severity: 'warning' | 'critical';
  timestamp: string;
}

const alerts: Alert[] = [
  {
    id: 'a1',
    type: 'overload',
    title: 'ER Overload Alert',
    message: 'Metro Central Hospital ER load at 88% capacity. Recommend patient redirect.',
    severity: 'critical',
    timestamp: '2 minutes ago',
  },
  {
    id: 'a2',
    type: 'prediction',
    title: 'Accident Prediction',
    message: 'AI model predicts high probability of multi-vehicle accident at Downtown Interchange in 15 minutes.',
    severity: 'critical',
    timestamp: '5 minutes ago',
  },
  {
    id: 'a3',
    type: 'resource',
    title: 'Resource Shortage',
    message: 'Harbor Health Complex oxygen supply below 80%. Resupply recommended within 2 hours.',
    severity: 'warning',
    timestamp: '12 minutes ago',
  },
];

const getAlertIcon = (type: Alert['type']) => {
  switch (type) {
    case 'overload':
      return <TrendingUp className="w-5 h-5" />;
    case 'prediction':
      return <AlertCircle className="w-5 h-5" />;
    case 'resource':
      return <Package className="w-5 h-5" />;
    default:
      return null;
  }
};

const getAlertColor = (severity: Alert['severity']) => {
  return severity === 'critical'
    ? 'bg-[hsl(var(--status-critical))]/10 border-[hsl(var(--status-critical))]/30 text-[hsl(var(--status-critical))]'
    : 'bg-[hsl(var(--status-warning))]/10 border-[hsl(var(--status-warning))]/30 text-[hsl(var(--status-warning))]';
};

export function AlertSystem() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Active Alerts ({alerts.length})</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 flex gap-4 ${getAlertColor(alert.severity)}`}
          >
            <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{alert.title}</h4>
              <p className="text-sm mt-1">{alert.message}</p>
              <p className="text-xs mt-2 opacity-75">{alert.timestamp}</p>
            </div>
            <button className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded bg-current/20 hover:bg-current/30 transition">
              ACK
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
