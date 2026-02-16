'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { mockHospitals, Hospital } from '@/lib/mockData';
import { Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function HospitalManagementContent() {
  const { user } = useAuth();
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    mockHospitals[0]
  );
  const [beds, setBeds] = useState(
    selectedHospital ? selectedHospital.beds : mockHospitals[0].beds
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );

  const handleHospitalChange = (hospitalId: string) => {
    const hospital = mockHospitals.find((h) => h.id === hospitalId);
    if (hospital) {
      setSelectedHospital(hospital);
      setBeds(hospital.beds);
      setMessage(null);
    }
  };

  const updateBedCount = (
    department: keyof Hospital['beds'],
    field: 'available' | 'occupied',
    value: number
  ) => {
    const dept = beds[department];
    const newAvailable =
      field === 'available' ? value : dept.total - value;
    const newOccupied =
      field === 'occupied' ? value : dept.total - newAvailable;

    if (newAvailable >= 0 && newOccupied >= 0 && newAvailable + newOccupied === dept.total) {
      setBeds({
        ...beds,
        [department]: {
          ...dept,
          available: newAvailable,
          occupied: newOccupied,
          occupancyRate: Math.round((newOccupied / dept.total) * 100),
        },
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setMessage({
      type: 'success',
      text: 'Bed availability updated successfully!',
    });
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  if (!selectedHospital) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Hospital Bed Management
          </h1>
          <p className="text-muted-foreground">
            Update real-time bed availability for your hospital
          </p>
        </div>

        {/* User Info */}
        {user?.role === 'hospital_admin' && (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Hospital Admin View</p>
              <p className="text-muted-foreground">
                Select your hospital and update bed availability in real-time
              </p>
            </div>
          </div>
        )}

        {/* Hospital Selection */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <label className="text-sm font-semibold text-foreground block mb-3">
            Select Your Hospital
          </label>
          <select
            value={selectedHospital.id}
            onChange={(e) => handleHospitalChange(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {mockHospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name} - {hospital.location}
              </option>
            ))}
          </select>
        </div>

        {/* Hospital Details */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-2">
            {selectedHospital.name}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {selectedHospital.address}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">ER Load</p>
              <p className="text-2xl font-bold text-foreground">
                {selectedHospital.erLoad}%
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-lg font-bold capitalize text-foreground">
                {selectedHospital.status}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Oxygen Supply</p>
              <p className="text-2xl font-bold text-foreground">
                {selectedHospital.oxygenSupply}%
              </p>
            </div>
          </div>
        </div>

        {/* Bed Management */}
        <div className="space-y-6 mb-8">
          {(Object.keys(beds) as Array<keyof Hospital['beds']>).map((department) => {
            const dept = beds[department];
            return (
              <div
                key={department}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-foreground mb-4 capitalize">
                  {dept.name} Department
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Total Beds
                    </label>
                    <p className="text-2xl font-bold text-primary">
                      {dept.total}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-3">
                      Available Beds: {dept.available}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={dept.total}
                      value={dept.available}
                      onChange={(e) =>
                        updateBedCount(
                          department,
                          'available',
                          Math.max(0, parseInt(e.target.value))
                        )
                      }
                      className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-3">
                      Occupied Beds: {dept.occupied}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={dept.total}
                      value={dept.occupied}
                      onChange={(e) =>
                        updateBedCount(
                          department,
                          'occupied',
                          Math.max(0, parseInt(e.target.value))
                        )
                      }
                      className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Occupancy Rate
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {dept.occupancyRate}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        dept.occupancyRate < 60
                          ? 'bg-[hsl(var(--status-stable))]'
                          : dept.occupancyRate < 80
                            ? 'bg-[hsl(var(--status-warning))]'
                            : 'bg-primary'
                      }`}
                      style={{
                        width: `${dept.occupancyRate}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Info */}
                <p className="text-xs text-muted-foreground">
                  {dept.available} available • {dept.occupied} occupied
                </p>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>

          {message && (
            <div
              className={`text-sm font-medium px-4 py-2 rounded-lg ${
                message.type === 'success'
                  ? 'bg-[hsl(var(--status-stable))]/10 text-[hsl(var(--status-stable))]'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HospitalManagementPage() {
  return (
    <ProtectedRoute>
      <HospitalManagementContent />
    </ProtectedRoute>
  );
}
