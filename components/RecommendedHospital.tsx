'use client';

import { Hospital } from '@/lib/mockData';
import { OptimizationResult } from '@/lib/aiOptimization';
import { Building2, Users, Zap, Clock, Heart, AlertCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendedHospitalProps {
  result: OptimizationResult;
  isLoading?: boolean;
  onReserve?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'stable':
      return 'bg-[hsl(var(--status-stable))]/20 border-[hsl(var(--status-stable))]/30 text-[hsl(var(--status-stable))]';
    case 'high-load':
      return 'bg-[hsl(var(--status-warning))]/20 border-[hsl(var(--status-warning))]/30 text-[hsl(var(--status-warning))]';
    case 'critical':
      return 'bg-[hsl(var(--status-critical))]/20 border-[hsl(var(--status-critical))]/30 text-[hsl(var(--status-critical))]';
    default:
      return 'bg-muted/20 border-muted/30 text-muted-foreground';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'stable':
      return 'Stable';
    case 'high-load':
      return 'High Load';
    case 'critical':
      return 'Critical';
    default:
      return 'Unknown';
  }
};

export function RecommendedHospital({ result, isLoading, onReserve }: RecommendedHospitalProps) {
  const hospital = result.recommendedHospital;
  const goldenWindowProtected = result.timeToGoldenWindow > 0;

  return (
    <div className="space-y-6">
      {/* Main Hospital Card */}
      <div className="bg-card border-2 border-primary/50 rounded-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{hospital.name}</h2>
              <p className="text-muted-foreground">{hospital.location}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-block px-4 py-2 rounded-full border font-semibold ${getStatusColor(hospital.status)}`}>
              {getStatusLabel(hospital.status)}
            </div>
          </div>
        </div>

        {/* AI Confidence */}
        <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-foreground font-semibold">AI Confidence Score</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <span className="text-2xl font-bold text-primary">{result.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-background p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Arrival Time</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {result.estimatedArrival}
              <span className="text-sm text-muted-foreground ml-1">min</span>
            </div>
          </div>

          <div className="bg-background p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">ICU Beds</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {result.estimatedBedAvailability}
              <span className="text-sm text-muted-foreground ml-1">available</span>
            </div>
          </div>

          <div className="bg-background p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Oxygen Supply</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {hospital.oxygenSupply}
              <span className="text-sm text-muted-foreground ml-1">%</span>
            </div>
          </div>

          <div className="bg-background p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">ER Load</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {hospital.erLoad}
              <span className="text-sm text-muted-foreground ml-1">%</span>
            </div>
          </div>
        </div>

        {/* Golden Window */}
        <div className="mb-6">
          {goldenWindowProtected ? (
            <div className="p-4 bg-[hsl(var(--status-stable))]/20 border border-[hsl(var(--status-stable))]/30 rounded-lg flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5 text-[hsl(var(--status-stable))]" />
              <div>
                <p className="font-semibold text-[hsl(var(--status-stable))]">
                  Golden Window Protected ✓
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.timeToGoldenWindow} minutes remain in the critical treatment window
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[hsl(var(--status-warning))]/20 border border-[hsl(var(--status-warning))]/30 rounded-lg flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-[hsl(var(--status-warning))]" />
              <div>
                <p className="font-semibold text-[hsl(var(--status-warning))]">
                  Golden Window at Risk
                </p>
                <p className="text-sm text-muted-foreground">
                  Arrival time exceeds the critical 10-minute window. Prepare advanced life support.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reserve Bed Button */}
        {onReserve && (
          <Button
            onClick={onReserve}
            className="w-full bg-primary hover:bg-primary/90 h-12 gap-2 text-base font-semibold"
          >
            <BookOpen className="w-5 h-5" />
            Reserve Bed for This Hospital
          </Button>
        )}
      </div>

      {/* Reasoning Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Why This Hospital?</h3>
        <ul className="space-y-3">
          {result.reasoning.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">{idx + 1}</span>
              </div>
              <span className="text-muted-foreground">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground mt-2">AI analyzing optimal routes...</p>
        </div>
      )}
    </div>
  );
}
