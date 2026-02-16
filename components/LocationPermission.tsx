'use client';

import { useState } from 'react';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserLocation, GeolocationCoordinates } from '@/lib/geolocation';

interface LocationPermissionProps {
  onLocationObtained: (location: GeolocationCoordinates) => void;
  isLoading?: boolean;
}

export function LocationPermission({ onLocationObtained, isLoading }: LocationPermissionProps) {
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestLocation = async () => {
    setIsRequesting(true);
    setError(null);

    try {
      const location = await getUserLocation();
      onLocationObtained(location);
    } catch (err: any) {
      setError(err.message || 'Failed to get location. Please try again.');
      setIsRequesting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Enable Location Access
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Allow access to your location to find nearby hospitals and optimize emergency response routing.
          </p>
          
          {error && (
            <div className="flex items-start gap-3 mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            onClick={handleRequestLocation}
            disabled={isRequesting || isLoading}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            {isRequesting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Access My Location
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
