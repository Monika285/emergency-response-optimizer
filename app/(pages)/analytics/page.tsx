'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  ResponseTimeChart,
  AccidentTimeChart,
} from '@/components/AnalyticsChart';
import { TrendingUp, Users, Clock, Heart } from 'lucide-react';

function AnalyticsPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">AI Analytics & Insights</h1>
          <p className="text-muted-foreground">
            System performance metrics and impact analysis
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-semibold text-[hsl(var(--status-stable))] bg-[hsl(var(--status-stable))]/20 px-2 py-1 rounded">
                +34%
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Peak Accident Time</h3>
            <p className="text-2xl font-bold text-foreground mb-2">12:00 PM</p>
            <p className="text-xs text-muted-foreground">Peak response window</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-xs font-semibold text-[hsl(var(--status-stable))] bg-[hsl(var(--status-stable))]/20 px-2 py-1 rounded">
                +28%
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Avg Bed Demand</h3>
            <p className="text-2xl font-bold text-foreground mb-2">4.2</p>
            <p className="text-xs text-muted-foreground">Patients per incident</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xs font-semibold text-[hsl(var(--status-stable))] bg-[hsl(var(--status-stable))]/20 px-2 py-1 rounded">
                +18%
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Traffic Impact</h3>
            <p className="text-2xl font-bold text-foreground mb-2">42%</p>
            <p className="text-xs text-muted-foreground">Average congestion during peak</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[hsl(var(--status-stable))]/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-[hsl(var(--status-stable))]" />
              </div>
              <span className="text-xs font-semibold text-[hsl(var(--status-stable))] bg-[hsl(var(--status-stable))]/20 px-2 py-1 rounded">
                +19%
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">Survival Rate</h3>
            <p className="text-2xl font-bold text-foreground mb-2">94.2%</p>
            <p className="text-xs text-muted-foreground">With AI optimization</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ResponseTimeChart />
          <AccidentTimeChart />
        </div>

        {/* Impact Summary */}
        <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Golden 10 Impact Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase mb-2">Response Time Saved</p>
              <p className="text-3xl font-bold text-primary">4.2 min</p>
              <p className="text-xs text-muted-foreground mt-1">Per incident</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase mb-2">Hospital Overload</p>
              <p className="text-3xl font-bold text-secondary">30.8%</p>
              <p className="text-xs text-muted-foreground mt-1">Average reduction</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase mb-2">Golden Window Rate</p>
              <p className="text-3xl font-bold text-accent">89%</p>
              <p className="text-xs text-muted-foreground mt-1">Success rate</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase mb-2">Lives Impacted</p>
              <p className="text-3xl font-bold text-[hsl(var(--status-stable))]">12,400+</p>
              <p className="text-xs text-muted-foreground mt-1">This year</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPageContent />
    </ProtectedRoute>
  );
}
