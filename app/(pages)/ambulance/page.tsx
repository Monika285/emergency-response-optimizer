'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { NearbyHospitals } from '@/components/NearbyHospitals';
import { mockHospitals, Hospital } from '@/lib/mockData';
import {
  getUserLocation,
  GeolocationCoordinates,
  calculateDistance,
  estimateTravelTime,
  formatDistance,
  formatTravelTime,
} from '@/lib/geolocation';
import { Phone, Navigation, AlertCircle, MapPin, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AmbulanceViewContent() {
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [careType, setCareType] = useState<string>('ICU');
  const [patientCount, setPatientCount] = useState(1);
  const [onRoute, setOnRoute] = useState(false);

  const handleGetLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const location = await getUserLocation();
      setUserLocation(location);

      // Calculate distance to all hospitals
      const hospitalsWithDistance = mockHospitals.map((hospital) => ({
        ...hospital,
        distance: calculateDistance(location, hospital.coordinates),
        travelTime: estimateTravelTime(
          calculateDistance(location, hospital.coordinates)
        ),
      }));

      setNearbyHospitals(
        hospitalsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleSelectAndRoute = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setOnRoute(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Ambulance Response Unit
          </h1>
          <p className="text-muted-foreground">
            Real-time hospital routing and emergency coordination
          </p>
        </div>

        {/* Status Banner */}
        {onRoute && selectedHospital ? (
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                  <Navigation className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">
                    Routing to {selectedHospital.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ETA: {formatTravelTime(estimateTravelTime(selectedHospital.distance || 0))} •
                    Distance: {formatDistance(selectedHospital.distance || 0)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setOnRoute(false)}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Cancel Route
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Location Status */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {userLocation ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[hsl(var(--status-stable))]/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[hsl(var(--status-stable))]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Location Active
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Scanning for nearby hospitals...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Enable Location
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click below to enable GPS
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleGetLocation}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  {loading ? 'Getting Location' : 'Enable Location'}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 mb-8 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">{error}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please enable location services and try again
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Main Content */}
        {onRoute && selectedHospital ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Hospital Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {selectedHospital.name}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {selectedHospital.address}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-2">Distance</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatDistance(selectedHospital.distance || 0)}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-2">ETA</p>
                    <p className="text-3xl font-bold text-secondary">
                      {formatTravelTime(
                        estimateTravelTime(selectedHospital.distance || 0)
                      )}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-2">ER Load</p>
                    <p className="text-3xl font-bold text-foreground">
                      {selectedHospital.erLoad}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <a href={`tel:${selectedHospital.phone}`} className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 gap-2 text-lg h-12">
                      <Phone className="w-5 h-5" />
                      Call Now
                    </Button>
                  </a>
                  <a
                    href={`https://maps.google.com/maps?q=${selectedHospital.coordinates.lat},${selectedHospital.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-border gap-2 text-lg h-12"
                    >
                      <Navigation className="w-5 h-5" />
                      Open Maps
                    </Button>
                  </a>
                </div>
              </div>

              {/* Bed Status */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-6">
                  Available Beds by Department
                </h3>
                <div className="space-y-4">
                  {(Object.entries(selectedHospital.beds) as Array<[string, any]>).map(
                    ([key, dept]) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground capitalize">
                            {dept.name}
                          </span>
                          <span className="text-lg font-bold text-primary">
                            {dept.available}/{dept.total}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                            style={{
                              width: `${(dept.available / dept.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {dept.occupancyRate}% occupancy
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <a
                    href={`tel:${selectedHospital.phone}`}
                    className="block"
                  >
                    <Button className="w-full bg-primary hover:bg-primary/90 gap-2">
                      <Phone className="w-4 h-4" />
                      Call ER
                    </Button>
                  </a>

                  <a
                    href={`https://maps.google.com/maps?q=${selectedHospital.coordinates.lat},${selectedHospital.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full border-border gap-2">
                      <MapPin className="w-4 h-4" />
                      Navigate
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    onClick={() => setOnRoute(false)}
                    className="w-full border-border"
                  >
                    Change Destination
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Hospital Status
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium capitalize">
                        {selectedHospital.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Oxygen Supply</span>
                      <span className="font-medium">
                        {selectedHospital.oxygenSupply}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : userLocation ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <NearbyHospitals
                hospitals={nearbyHospitals}
                careType={careType}
                requiredBeds={patientCount}
                onSelectHospital={handleSelectAndRoute}
              />
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 h-fit">
              <h3 className="text-lg font-bold text-foreground mb-6">
                Emergency Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Care Type Required
                  </label>
                  <select
                    value={careType}
                    onChange={(e) => setCareType(e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ICU">ICU</option>
                    <option value="trauma">Trauma</option>
                    <option value="general">General</option>
                    <option value="pediatric">Pediatric</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Number of Patients
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={patientCount}
                    onChange={(e) => setPatientCount(parseInt(e.target.value))}
                    className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-2">Nearby Hospitals</p>
                  <p className="text-3xl font-bold text-primary">
                    {nearbyHospitals.length}
                  </p>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-foreground font-medium">
                    📍 Click a hospital from the list to navigate
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <Navigation className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">Enable Location Services</p>
            <p className="text-muted-foreground text-sm mb-6">
              Click the button above to enable GPS and start finding nearby hospitals
            </p>
            <Button onClick={handleGetLocation} disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              Enable Location
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AmbulancePage() {
  return (
    <ProtectedRoute>
      <AmbulanceViewContent />
    </ProtectedRoute>
  );
}
