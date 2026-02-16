'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHospitals, RegisteredHospital } from '@/hooks/useHospitals';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  getUserLocation,
  GeolocationCoordinates,
  calculateDistance,
  formatDistance,
  estimateTravelTime,
} from '@/lib/geolocation';
import { MapPin, AlertCircle, Navigation, Loader2, Phone, Bed, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HospitalWithDistance extends RegisteredHospital {
  distance: number;
  travelTime: number;
  totalAvailable: number;
}

function EmergencyLocationContent() {
  const router = useRouter();
  const { hospitals } = useHospitals();
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<HospitalWithDistance[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<HospitalWithDistance | null>(null);
  const [careType, setCareType] = useState<string>('icu');

  const handleGetLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const location = await getUserLocation();
      setUserLocation(location);

      // Calculate distance for registered hospitals
      const hospitalsWithDistance: HospitalWithDistance[] = hospitals
        .filter((h) => h.status === 'active')
        .map((hospital) => {
          const distance = calculateDistance(location, hospital.coordinates);
          const totalAvailable = Object.values(hospital.availableBeds).reduce((a, b) => a + b, 0);
          return {
            ...hospital,
            distance,
            travelTime: estimateTravelTime(distance),
            totalAvailable,
          };
        })
        .sort((a, b) => a.distance - b.distance);

      setNearbyHospitals(hospitalsWithDistance);

      if (hospitalsWithDistance.length === 0) {
        setError('No hospitals registered in the Golden 10 network yet.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get location. Please enable location services.');
    } finally {
      setLoading(false);
    }
  };

  const getBedsForType = (hospital: HospitalWithDistance) => {
    return hospital.availableBeds[careType as keyof typeof hospital.availableBeds] || 0;
  };

  const getTotalBedsForType = (hospital: HospitalWithDistance) => {
    return hospital.totalBeds[careType as keyof typeof hospital.totalBeds] || 0;
  };

  const getOccupancyRate = (hospital: HospitalWithDistance) => {
    const type = careType as keyof typeof hospital.totalBeds;
    const total = hospital.totalBeds[type] || 1;
    const available = hospital.availableBeds[type] || 0;
    const occupied = total - available;
    return Math.round((occupied / total) * 100);
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleSelectHospital = (hospital: HospitalWithDistance) => {
    setSelectedHospital(hospital);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Emergency Response - Find Beds</h1>
          <p className="text-muted-foreground">
            Locate nearby hospitals with available beds in real-time
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Selector */}
        {!userLocation ? (
          <Card className="p-12 text-center border-border/50 mb-8">
            <MapPin className="w-16 h-16 text-primary mx-auto mb-4 opacity-30" />
            <h2 className="text-2xl font-bold text-foreground mb-3">Enable Location Services</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              To find nearby hospitals with available beds, we need access to your location. This helps us show you
              the closest medical facilities.
            </p>
            <Button
              onClick={handleGetLocation}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-lg px-8 h-12 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  Enable Location & Search
                </>
              )}
            </Button>
          </Card>
        ) : (
          <>
            {/* Location info and filters */}
            <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Location enabled • {nearbyHospitals.length} hospitals found</span>
              </div>
              <div className="flex gap-3">
                <select
                  value={careType}
                  onChange={(e) => setCareType(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-muted border border-border text-foreground text-sm"
                >
                  <option value="icu">ICU Beds</option>
                  <option value="trauma">Trauma Beds</option>
                  <option value="general">General Beds</option>
                  <option value="pediatric">Pediatric Beds</option>
                </select>
                <Button
                  onClick={handleGetLocation}
                  variant="outline"
                  className="gap-2"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                  Refresh
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Error message */}
        {error && (
          <Card className="mb-8 bg-destructive/10 border-destructive/30 p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-destructive font-medium">No hospitals found</p>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
              <Button
                onClick={() => router.push('/register-hospital')}
                variant="outline"
                className="mt-3 text-destructive border-destructive hover:bg-destructive/10"
              >
                Register Your Hospital
              </Button>
            </div>
          </Card>
        )}

        {/* Hospitals List and Detail */}
        {userLocation && nearbyHospitals.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Hospital List */}
            <div className="lg:col-span-1">
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {nearbyHospitals.map((hospital) => (
                  <Card
                    key={hospital.id}
                    onClick={() => handleSelectHospital(hospital)}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      selectedHospital?.id === hospital.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <h3 className="font-bold text-foreground mb-2">{hospital.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{hospital.distance.toFixed(1)} km away</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{hospital.travelTime} min drive</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-secondary" />
                        <span className="font-semibold text-secondary">
                          {getBedsForType(hospital)} beds available
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Hospital Details */}
            {selectedHospital && (
              <div className="lg:col-span-2">
                <Card className="p-8 border-border/50 sticky top-32">
                  {/* Header */}
                  <h2 className="text-3xl font-bold text-foreground mb-2">{selectedHospital.name}</h2>
                  <p className="text-muted-foreground mb-6">{selectedHospital.address}</p>

                  {/* Key metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="text-sm text-muted-foreground">Distance</div>
                      <div className="text-2xl font-bold text-foreground">
                        {selectedHospital.distance.toFixed(1)} km
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="text-sm text-muted-foreground">Estimated Drive</div>
                      <div className="text-2xl font-bold text-foreground">
                        {selectedHospital.travelTime} min
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="text-sm text-muted-foreground">Available {careType.toUpperCase()} Beds</div>
                      <div className="text-2xl font-bold text-secondary">
                        {getBedsForType(selectedHospital)}/{getTotalBedsForType(selectedHospital)}
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <div className="text-sm text-muted-foreground">Occupancy Rate</div>
                      <div
                        className={`text-2xl font-bold ${
                          getOccupancyRate(selectedHospital) > 80
                            ? 'text-destructive'
                            : getOccupancyRate(selectedHospital) > 50
                            ? 'text-accent'
                            : 'text-[hsl(var(--status-stable))]'
                        }`}
                      >
                        {getOccupancyRate(selectedHospital)}%
                      </div>
                    </div>
                  </div>

                  {/* Bed breakdown */}
                  <div className="mb-8">
                    <h3 className="font-bold text-foreground mb-4">Bed Availability by Department</h3>
                    <div className="space-y-3">
                      {(['icu', 'trauma', 'general', 'pediatric'] as const).map((type) => {
                        const available = selectedHospital.availableBeds[type];
                        const total = selectedHospital.totalBeds[type];
                        const occupied = total - available;
                        const rate = Math.round((occupied / total) * 100);
                        return (
                          <div key={type}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-foreground capitalize">{type}</span>
                              <span className="text-sm text-muted-foreground">
                                {available}/{total} available
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  rate > 80
                                    ? 'bg-destructive'
                                    : rate > 50
                                    ? 'bg-accent'
                                    : 'bg-[hsl(var(--status-stable))]'
                                }`}
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {occupied} occupied ({rate}%)
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="mb-8 border-t border-border pt-6">
                    <h3 className="font-bold text-foreground mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Phone</div>
                        <a
                          href={`tel:${selectedHospital.phone}`}
                          className="text-primary hover:underline font-semibold"
                        >
                          {selectedHospital.phone}
                        </a>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Email</div>
                        <a
                          href={`mailto:${selectedHospital.email}`}
                          className="text-primary hover:underline font-semibold"
                        >
                          {selectedHospital.email}
                        </a>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Emergency Contact</div>
                        <p className="font-semibold text-foreground">{selectedHospital.emergencyContact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleCall(selectedHospital.phone)}
                      className="w-full bg-primary hover:bg-primary/90 text-lg h-12 gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Call Hospital
                    </Button>
                    <Button variant="outline" className="w-full text-lg h-12">
                      Get Navigation
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Empty state when location enabled but no hospitals */}
        {userLocation && nearbyHospitals.length === 0 && !error && (
          <Card className="p-12 text-center border-border/50">
            <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4 opacity-30" />
            <h2 className="text-2xl font-bold text-foreground mb-3">No Hospitals Registered Yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Hospitals in your area haven't registered with the Golden 10 network yet. Be the first to register your
              hospital!
            </p>
            <Button
              onClick={() => router.push('/register-hospital')}
              className="bg-primary hover:bg-primary/90 px-8"
            >
              Register Your Hospital
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <ProtectedRoute>
      <EmergencyLocationContent />
    </ProtectedRoute>
  );
}
