'use client';

import { useState } from 'react';
import { Hospital } from '@/lib/mockData';
import { Map, Navigation, AlertTriangle, CheckCircle, MapPin, Navigation2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RoutePanelProps {
  hospital: Hospital;
  estimatedArrival: number;
  trafficDensity: number;
  timeSaved: number;
}

export function RoutePanel({
  hospital,
  estimatedArrival,
  trafficDensity,
  timeSaved,
}: RoutePanelProps) {
  const [sourceLocation, setSourceLocation] = useState('');
  const [showMap, setShowMap] = useState(false);
  const alternativeTime = estimatedArrival + Math.ceil(Math.random() * 8 + 4); // 4-12 min longer

  const handleGetDirections = () => {
    if (!sourceLocation) {
      alert('Please enter source location');
      return;
    }
    // Generate Google Maps URL
    const mapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(sourceLocation)}/${encodeURIComponent(
      hospital.address
    )}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Source Location Selection */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Select Route Source
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Emergency Location / Source
            </label>
            <Input
              type="text"
              placeholder="Enter pickup location, address, or coordinates"
              value={sourceLocation}
              onChange={(e) => setSourceLocation(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Example: &quot;123 Main St&quot; or &quot;Central Park&quot;
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleGetDirections}
              className="flex-1 bg-primary hover:bg-primary/90 gap-2"
            >
              <Navigation2 className="w-4 h-4" />
              Get Directions on Google Maps
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowMap(!showMap)}
              className="border-border"
            >
              <Map className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-secondary/30 rounded-lg p-8 aspect-video flex items-center justify-center">
        <div className="text-center">
          <Map className="w-16 h-16 text-secondary/50 mx-auto mb-4" />
          <p className="text-muted-foreground font-semibold">Route Visualization</p>
          <p className="text-xs text-muted-foreground mt-1">
            {sourceLocation ? `From: ${sourceLocation}` : 'Enter source location above'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            To: {hospital.name}
          </p>
          {sourceLocation && (
            <p className="text-xs text-[hsl(var(--status-stable))] mt-2 font-semibold">
              Distance: {hospital.distance?.toFixed(1) || '2.5'} km | ETA: {estimatedArrival} min
            </p>
          )}
        </div>
      </div>

      {/* Route Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Route */}
        <div className="bg-card border-2 border-primary/50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-[hsl(var(--status-stable))]" />
            <h3 className="font-semibold text-foreground">Recommended Route</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Destination</p>
              <p className="text-lg font-bold text-foreground">{hospital.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Distance</p>
                <p className="text-xl font-bold text-secondary">
                  {hospital.distance?.toFixed(1) || '2.5'}
                  <span className="text-sm text-muted-foreground ml-1">km</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Arrival</p>
                <p className="text-xl font-bold text-primary">
                  {estimatedArrival}
                  <span className="text-sm text-muted-foreground ml-1">min</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase mb-2">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--status-stable))]" />
                <span className="text-sm text-muted-foreground">Route optimized and clear</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Route */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Alternative Route</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Destination</p>
              <p className="text-lg font-bold text-foreground">Riverside Medical Center</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Distance</p>
                <p className="text-xl font-bold text-muted-foreground">
                  {(hospital.distance || 2.5) + 1.2}
                  <span className="text-sm text-muted-foreground ml-1">km</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Arrival</p>
                <p className="text-xl font-bold text-muted-foreground">
                  {alternativeTime}
                  <span className="text-sm text-muted-foreground ml-1">min</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase mb-2">Impact</p>
              <p className="text-sm text-muted-foreground">
                +{alternativeTime - estimatedArrival} min slower than primary route
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic & Time Saved */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traffic Indicator */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Traffic Conditions</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Current Density</span>
                <span className="text-sm font-semibold text-foreground">{trafficDensity}%</span>
              </div>
              <div className="w-full h-2 bg-input rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${trafficDensity}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase mb-2">Impact on ETA</p>
              <p className="text-sm text-muted-foreground">
                {trafficDensity < 30
                  ? '✓ Minimal impact - conditions favorable'
                  : trafficDensity < 70
                  ? '⚠ Moderate delays expected'
                  : '⚠ Heavy congestion - urgent dispatch recommended'}
              </p>
            </div>
          </div>
        </div>

        {/* Time Saved */}
        <div className="bg-gradient-to-br from-[hsl(var(--status-stable))]/20 to-[hsl(var(--status-stable))]/5 border border-[hsl(var(--status-stable))]/30 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Golden 10 Savings</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-2">Time Saved vs Standard</p>
              <p className="text-3xl font-bold text-[hsl(var(--status-stable))]">
                {timeSaved}
                <span className="text-lg text-muted-foreground ml-2">minutes</span>
              </p>
            </div>

            <div className="pt-4 border-t border-[hsl(var(--status-stable))]/20">
              <p className="text-sm text-muted-foreground">
                AI optimization reduces dispatch & arrival time compared to manual routing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Golden Window Protected Badge */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-lg p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Navigation className="w-6 h-6 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Golden Window Protected</p>
            <p className="text-sm text-muted-foreground">
              Route optimized to preserve the critical treatment window
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{estimatedArrival}</div>
          <div className="text-xs text-muted-foreground">minutes</div>
        </div>
      </div>
    </div>
  );
}
