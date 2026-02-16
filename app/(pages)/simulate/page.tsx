'use client';

import { useState, useEffect } from 'react';
import { SimulationForm, SimulationInput } from '@/components/SimulationForm';
import { RecommendedHospital } from '@/components/RecommendedHospital';
import { RoutePanel } from '@/components/RoutePanel';
import { BedReservationForm } from '@/components/BedReservationForm';
import { ReservationReceipt } from '@/components/ReservationReceipt';
import { LocationPermission } from '@/components/LocationPermission';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useHospitals } from '@/hooks/useHospitals';
import { getHospitalsWithDistance, Accident } from '@/lib/mockData';
import { optimizeHospitalRoute, OptimizationResult } from '@/lib/aiOptimization';
import { hasAvailableBeds } from '@/lib/bedManagement';
import { GeolocationCoordinates, calculateDistance } from '@/lib/geolocation';

function SimulatePageContent() {
  const { user } = useAuth();
  const { hospitals } = useHospitals();
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [simInput, setSimInput] = useState<SimulationInput | null>(null);
  const [noHospitalsAvailable, setNoHospitalsAvailable] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservation, setReservation] = useState<any>(null);

  const handleSimulation = async (data: SimulationInput) => {
    if (!userLocation) {
      alert('Please enable location access first');
      return;
    }

    setIsLoading(true);
    setSimInput(data);
    setNoHospitalsAvailable(false);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create accident object using user's location
    const accidentCoordinates = userLocation;

    const accident: Accident = {
      id: 'acc-' + Date.now(),
      location: data.location,
      severity: data.severity,
      careType: data.careType,
      patientCount: data.patientCount,
      coordinates: accidentCoordinates,
    };

    // Combine registered hospitals with hardcoded hospitals
    let allHospitals = [...hospitals];
    
    // Add hardcoded hospitals if they're not already registered
    const registeredIds = new Set(hospitals.map(h => h.id));
    const { mockHospitals } = require('@/lib/mockData');
    const hardcodedHospitals = mockHospitals.filter((h: any) => !registeredIds.has(h.id));
    allHospitals = [...allHospitals, ...hardcodedHospitals];

    // Filter hospitals by proximity (within 50km) and available beds
    const nearbyHospitals = allHospitals.filter((hospital) => {
      const distance = calculateDistance(accidentCoordinates, hospital.coordinates);
      return distance <= 50 && hasAvailableBeds(hospital, data.careType, data.patientCount);
    });

    if (nearbyHospitals.length === 0) {
      setResult(null);
      setNoHospitalsAvailable(true);
      setIsLoading(false);
      return;
    }

    // Get hospitals with distances
    const hospitalsWithDistance = getHospitalsWithDistance(accidentCoordinates, nearbyHospitals);

    // Calculate traffic density based on distance (closer = less traffic, farther = more traffic)
    // Assumes average hospital distance of 5km
    const avgDistance = hospitalsWithDistance.reduce((sum, h) => sum + (h.distance || 5), 0) / hospitalsWithDistance.length;
    const calculatedTrafficDensity = Math.min(100, Math.round((avgDistance / 10) * 100));

    // Optimize route with calculated traffic
    const optimizationResult = optimizeHospitalRoute(
      hospitalsWithDistance,
      accident,
      calculatedTrafficDensity
    );

    setResult(optimizationResult);
    setIsLoading(false);
  };

  const timeSaved = Math.ceil(Math.random() * 4 + 2); // 2-6 minutes

  // Show reservation receipt if reservation was completed
  if (reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ReservationReceipt 
            reservation={reservation}
            onClose={() => {
              setReservation(null);
              setShowReservationForm(false);
              setResult(null);
            }}
          />
        </div>
      </div>
    );
  }

  // Show reservation form if user clicked reserve
  if (showReservationForm && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BedReservationForm
            hospital={result.recommendedHospital}
            careType={simInput?.careType || 'ICU'}
            onSubmit={(reservationData) => {
              setReservation({
                ...reservationData,
                hospital: result.recommendedHospital,
                estimatedArrival: result.estimatedArrival,
                confidence: result.confidence,
                timestamp: new Date().toISOString(),
              });
            }}
            onCancel={() => {
              setShowReservationForm(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Emergency Simulation</h1>
          <p className="text-muted-foreground">
            Test AI-optimized hospital routing with real-time conditions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-20">
              {/* Location Permission */}
              {!userLocation && (
                <LocationPermission
                  onLocationObtained={setUserLocation}
                  isLoading={isLoading}
                />
              )}

              {/* Scenario Configuration */}
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Scenario Configuration
                </h2>
                <SimulationForm onSubmit={handleSimulation} isLoading={isLoading} />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-8">
                {/* Recommended Hospital */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    AI Recommendation
                  </h2>
                  <RecommendedHospital 
                    result={result}
                    onReserve={() => setShowReservationForm(true)}
                  />
                </div>

                {/* Smart Route Panel */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Smart Route & Traffic
                  </h2>
                  <RoutePanel
                    hospital={result.recommendedHospital}
                    estimatedArrival={result.estimatedArrival}
                    trafficDensity={Math.round((result.recommendedHospital.distance || 5) / 10 * 100)}
                    timeSaved={timeSaved}
                  />
                </div>
              </div>
            ) : noHospitalsAvailable ? (
              <div className="bg-card border border-primary/20 rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4v2m0 4v2M6.72 6.72a4 4 0 105.656 5.656m-3.535 3.535a4 4 0 105.656-5.656"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  No Hospitals Available
                </h3>
                <p className="text-muted-foreground mb-4">
                  No registered hospitals have available {simInput?.careType} beds for {simInput?.patientCount} patient{simInput?.patientCount !== 1 ? 's' : ''}.
                </p>
                <p className="text-sm text-muted-foreground">
                  Contact hospital admins to register hospitals or update bed availability.
                </p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to Simulate
                </h3>
                <p className="text-muted-foreground">
                  Configure an emergency scenario and run the simulation to see AI-powered hospital
                  routing recommendations based on hospitals with available beds.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SimulatePage() {
  return (
    <ProtectedRoute>
      <SimulatePageContent />
    </ProtectedRoute>
  );
}
