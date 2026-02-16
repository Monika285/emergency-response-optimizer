'use client';

import { Hospital } from '@/lib/mockData';
import { Phone, MapPin, AlertTriangle, Check } from 'lucide-react';
import {
  formatDistance,
  formatTravelTime,
  estimateTravelTime,
} from '@/lib/geolocation';
import {
  getAvailableBedsByType,
  getOccupancyStatus,
  getOccupancyLabel,
} from '@/lib/bedManagement';

interface NearbyHospitalsProps {
  hospitals: Hospital[];
  careType: string;
  requiredBeds: number;
  onSelectHospital?: (hospital: Hospital) => void;
}

export function NearbyHospitals({
  hospitals,
  careType,
  requiredBeds,
  onSelectHospital,
}: NearbyHospitalsProps) {
  // Sort by distance
  const sortedHospitals = [...hospitals].sort(
    (a, b) => (a.distance || 0) - (b.distance || 0)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Nearby Hospitals ({sortedHospitals.length})
        </h3>
        <span className="text-xs text-muted-foreground">Sorted by distance</span>
      </div>

      {sortedHospitals.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-muted-foreground">No hospitals found nearby</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {sortedHospitals.map((hospital) => {
            const availableBeds = getAvailableBedsByType(hospital, careType);
            const hasEnoughBeds = availableBeds >= requiredBeds;
            const occupancyStatus = getOccupancyStatus(
              hospital.beds[careType.toLowerCase() as keyof Hospital['beds']]
                ?.occupancyRate || 0
            );
            const travelTime = estimateTravelTime(hospital.distance || 0);

            return (
              <div
                key={hospital.id}
                onClick={() => onSelectHospital?.(hospital)}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {hospital.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{hospital.location}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {hospital.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">
                      {formatDistance(hospital.distance || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ~{formatTravelTime(travelTime)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      Available Beds
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {availableBeds}
                      </div>
                      {hasEnoughBeds ? (
                        <Check className="w-4 h-4 text-[hsl(var(--status-stable))]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      Occupancy
                    </div>
                    <div className="text-lg font-bold">
                      {hospital.beds[
                        careType.toLowerCase() as keyof Hospital['beds']
                      ]?.occupancyRate || 0}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        hospital.status === 'stable'
                          ? 'hsl(var(--status-stable))'
                          : hospital.status === 'high-load'
                            ? 'hsl(var(--status-warning))'
                            : 'hsl(var(--primary))',
                    }}
                  ></div>
                  <span className="text-xs font-medium text-muted-foreground capitalize">
                    {hospital.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • ER Load: {hospital.erLoad}%
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <a
                    href={`tel:${hospital.phone}`}
                    className="text-xs text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {hospital.phone}
                  </a>
                  {hasEnoughBeds && (
                    <div className="ml-auto px-2 py-1 bg-[hsl(var(--status-stable))]/10 text-[hsl(var(--status-stable))] rounded text-xs font-medium">
                      Available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
