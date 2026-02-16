'use client';

import { Hospital } from '@/lib/mockData';

interface HospitalTableProps {
  hospitals: Hospital[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'stable':
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--status-stable))]/20 text-[hsl(var(--status-stable))]">
          ✓ Stable
        </span>
      );
    case 'high-load':
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--status-warning))]/20 text-[hsl(var(--status-warning))]">
          ⚠ High Load
        </span>
      );
    case 'critical':
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--status-critical))]/20 text-[hsl(var(--status-critical))]">
          🚨 Critical
        </span>
      );
    default:
      return null;
  }
};

const getCapacityColor = (available: number, total: number) => {
  const percentage = (available / total) * 100;
  if (percentage > 50) return 'text-[hsl(var(--status-stable))]';
  if (percentage > 20) return 'text-[hsl(var(--status-warning))]';
  return 'text-[hsl(var(--status-critical))]';
};

export function HospitalTable({ hospitals }: HospitalTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Hospital Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                ICU Beds
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                O₂ Supply
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                ER Load
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {hospitals.map((hospital) => (
              <tr key={hospital.id} className="hover:bg-background/30 transition">
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {hospital.name}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{hospital.location}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`font-semibold ${getCapacityColor(hospital.icuBedsAvailable, hospital.icuBeds)}`}>
                    {hospital.icuBedsAvailable}/{hospital.icuBeds}
                  </span>
                  <div className="w-16 h-1.5 bg-input rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(hospital.icuBedsAvailable / hospital.icuBeds) * 100}%`,
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">
                  {hospital.oxygenSupply}%
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">
                  {hospital.erLoad}%
                </td>
                <td className="px-6 py-4 text-sm">{getStatusBadge(hospital.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
