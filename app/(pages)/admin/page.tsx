'use client';

import { useState } from 'react';
import { HospitalTable } from '@/components/HospitalTable';
import { OccupancyChart } from '@/components/OccupancyChart';
import { AlertSystem } from '@/components/AlertSystem';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { mockHospitals } from '@/lib/mockData';
import { Toggle } from '@/components/ui/toggle';
import { AlertCircle } from 'lucide-react';

function AdminPageContent() {
  const [emergencyMode, setEmergencyMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-foreground">Hospital Operations Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Emergency Priority Mode</span>
              <Toggle
                pressed={emergencyMode}
                onPressedChange={setEmergencyMode}
                className={`${
                  emergencyMode
                    ? 'bg-[hsl(var(--status-critical))] text-white'
                    : 'bg-background border border-border'
                }`}
              >
                {emergencyMode ? '🚨 ON' : 'OFF'}
              </Toggle>
            </div>
          </div>
          <p className="text-muted-foreground">
            Real-time hospital capacity and resource monitoring
          </p>
        </div>

        {emergencyMode && (
          <div className="mb-8 p-4 bg-[hsl(var(--status-critical))]/20 border border-[hsl(var(--status-critical))]/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[hsl(var(--status-critical))]" />
            <div>
              <p className="font-semibold text-[hsl(var(--status-critical))]">
                Emergency Priority Mode Activated
              </p>
              <p className="text-sm text-muted-foreground">
                All hospitals on alert. Patient distribution protocols active. Auto-redirect enabled.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Key Metrics */}
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground uppercase mb-2">Total Capacity</p>
            <p className="text-3xl font-bold text-foreground">
              {mockHospitals.reduce((acc, h) => acc + h.icuBeds, 0)}
              <span className="text-sm text-muted-foreground ml-2">beds</span>
            </p>
            <div className="mt-4 h-2 bg-input rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${
                    ((mockHospitals.reduce((acc, h) => acc + (h.icuBeds - h.icuBedsAvailable), 0) /
                      mockHospitals.reduce((acc, h) => acc + h.icuBeds, 0)) *
                      100)
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {mockHospitals.reduce((acc, h) => acc + (h.icuBeds - h.icuBedsAvailable), 0)} beds
              occupied
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground uppercase mb-2">Oxygen Supply</p>
            <p className="text-3xl font-bold text-foreground">
              {Math.round(
                mockHospitals.reduce((acc, h) => acc + h.oxygenSupply, 0) / mockHospitals.length
              )}
              <span className="text-sm text-muted-foreground ml-2">avg %</span>
            </p>
            <div className="mt-4 h-2 bg-input rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary"
                style={{
                  width: `${Math.round(mockHospitals.reduce((acc, h) => acc + h.oxygenSupply, 0) / mockHospitals.length)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Network average</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground uppercase mb-2">ER Average Load</p>
            <p className="text-3xl font-bold text-foreground">
              {Math.round(mockHospitals.reduce((acc, h) => acc + h.erLoad, 0) / mockHospitals.length)}
              <span className="text-sm text-muted-foreground ml-2">%</span>
            </p>
            <div className="mt-4 h-2 bg-input rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: `${Math.round(mockHospitals.reduce((acc, h) => acc + h.erLoad, 0) / mockHospitals.length)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Across all facilities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hospital Table */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Hospital Status</h2>
              <HospitalTable hospitals={mockHospitals} />
            </div>

            {/* Chart */}
            <div>
              <OccupancyChart />
            </div>
          </div>

          {/* Sidebar - Alerts */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <AlertSystem />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminPageContent />
    </ProtectedRoute>
  );
}
