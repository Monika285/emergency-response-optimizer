'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHospitals } from '@/hooks/useHospitals';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, Plus, Minus, Save, LogOut } from 'lucide-react';

function HospitalProfileContent() {
  const router = useRouter();
  const { hospitals, updateHospitalBeds, updateCurrentPatients, deleteHospital } = useHospitals();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [currentPatients, setCurrentPatients] = useState(0);
  const [availableBeds, setAvailableBeds] = useState({
    icu: 0,
    trauma: 0,
    general: 0,
    pediatric: 0,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId);

  useEffect(() => {
    if (hospitals.length > 0 && !selectedHospitalId) {
      setSelectedHospitalId(hospitals[0].id);
    }
  }, [hospitals, selectedHospitalId]);

  useEffect(() => {
    if (selectedHospital) {
      setCurrentPatients(selectedHospital.currentPatients);
      setAvailableBeds(selectedHospital.availableBeds);
    }
  }, [selectedHospital]);

  const handleBedChange = (
    type: keyof typeof availableBeds,
    amount: number
  ) => {
    if (!selectedHospital) return;
    const maxBeds = selectedHospital.totalBeds[type];
    setAvailableBeds((prev) => ({
      ...prev,
      [type]: Math.max(0, Math.min(maxBeds, prev[type] + amount)),
    }));
  };

  const handleSave = async () => {
    if (!selectedHospital) {
      setError('Please select a hospital');
      return;
    }

    try {
      updateHospitalBeds(selectedHospitalId, availableBeds);
      updateCurrentPatients(selectedHospitalId, currentPatients);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save changes');
    }
  };

  const handleDeleteHospital = () => {
    if (!selectedHospital) return;
    if (confirm(`Are you sure you want to delete ${selectedHospital.name}?`)) {
      deleteHospital(selectedHospitalId);
      if (hospitals.length > 1) {
        const nextId = hospitals.find((h) => h.id !== selectedHospitalId)?.id;
        if (nextId) setSelectedHospitalId(nextId);
      } else {
        router.push('/register-hospital');
      }
    }
  };

  if (hospitals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center border-border/50">
            <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4 opacity-30" />
            <h1 className="text-3xl font-bold text-foreground mb-3">No Hospitals Registered</h1>
            <p className="text-muted-foreground mb-8">
              Please register your hospital first to manage bed availability.
            </p>
            <Button
              onClick={() => router.push('/register-hospital')}
              className="bg-primary hover:bg-primary/90 px-8"
            >
              Register Hospital
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Hospital Profile</h1>
          <p className="text-muted-foreground">Update bed availability and patient information in real-time</p>
        </div>

        {success && (
          <Card className="mb-6 bg-green-500/10 border-green-500/30 p-4">
            <p className="text-green-400 font-medium">Changes saved successfully!</p>
          </Card>
        )}

        {error && (
          <Card className="mb-6 bg-destructive/10 border-destructive/30 p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-destructive">{error}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Hospital List */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-border/50">
              <h2 className="text-lg font-bold text-foreground mb-4">Your Hospitals</h2>
              <div className="space-y-2">
                {hospitals.map((hospital) => (
                  <button
                    key={hospital.id}
                    onClick={() => setSelectedHospitalId(hospital.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedHospitalId === hospital.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold text-foreground truncate">
                      {hospital.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {hospital.status === 'active' ? (
                        <span className="text-[hsl(var(--status-stable))]">● Active</span>
                      ) : (
                        <span className="text-muted-foreground">● Inactive</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <Button
                onClick={() => router.push('/register-hospital')}
                variant="outline"
                className="w-full mt-4"
              >
                Add New Hospital
              </Button>
            </Card>
          </div>

          {/* Hospital Details */}
          {selectedHospital && (
            <div className="lg:col-span-3 space-y-6">
              {/* Basic Info */}
              <Card className="p-8 border-border/50">
                <h2 className="text-2xl font-bold text-foreground mb-6">Hospital Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Hospital Name
                    </label>
                    <div className="text-lg font-semibold text-foreground">
                      {selectedHospital.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Email
                    </label>
                    <div className="text-lg font-semibold text-foreground">
                      {selectedHospital.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Phone
                    </label>
                    <div className="text-lg font-semibold text-foreground">
                      {selectedHospital.phone}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Emergency Contact
                    </label>
                    <div className="text-lg font-semibold text-foreground">
                      {selectedHospital.emergencyContact}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Address
                    </label>
                    <div className="text-lg font-semibold text-foreground">
                      {selectedHospital.address}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Current Status */}
              <Card className="p-8 border-border/50">
                <h2 className="text-2xl font-bold text-foreground mb-6">Current Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/30 rounded-lg p-6 border border-border">
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      Current Patients Admitted
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={currentPatients}
                        onChange={(e) => setCurrentPatients(Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        max={selectedHospital.totalCapacity}
                        className="bg-muted/50 border-border text-lg"
                      />
                      <span className="text-muted-foreground">
                        / {selectedHospital.totalCapacity}
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-6 border border-border">
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      Hospital Occupancy
                    </label>
                    <div className="text-3xl font-bold text-foreground">
                      {Math.round((currentPatients / selectedHospital.totalCapacity) * 100)}%
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bed Availability */}
              <Card className="p-8 border-border/50">
                <h2 className="text-2xl font-bold text-foreground mb-6">Bed Availability by Department</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(['icu', 'trauma', 'general', 'pediatric'] as const).map((type) => {
                    const total = selectedHospital.totalBeds[type];
                    const available = availableBeds[type];
                    const occupied = total - available;
                    const rate = Math.round((occupied / total) * 100);

                    return (
                      <div key={type} className="border border-border rounded-lg p-6 bg-muted/20">
                        <h3 className="text-lg font-bold text-foreground capitalize mb-6">
                          {type} Ward
                        </h3>

                        {/* Occupancy bar */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Occupancy</span>
                            <span className="font-bold text-foreground">{rate}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
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
                        </div>

                        {/* Bed count info */}
                        <div className="flex justify-between mb-4 text-sm">
                          <span className="text-muted-foreground">Available</span>
                          <span className="font-bold text-secondary">{available}</span>
                        </div>
                        <div className="flex justify-between mb-6 text-sm">
                          <span className="text-muted-foreground">Occupied</span>
                          <span className="font-bold text-foreground">{occupied}</span>
                        </div>
                        <div className="flex justify-between mb-6 text-sm pb-6 border-b border-border">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-bold text-foreground">{total}</span>
                        </div>

                        {/* Controls */}
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Update Available Beds
                        </label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleBedChange(type, -1)}
                            className="flex-1"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <div className="flex-1 flex items-center justify-center bg-muted/50 rounded border border-border">
                            <span className="font-bold text-foreground">{available}</span>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleBedChange(type, 1)}
                            className="flex-1"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-primary/90 text-lg h-12 gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleDeleteHospital}
                  variant="outline"
                  className="text-lg h-12 border-destructive text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-5 h-5" />
                  Delete Hospital
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HospitalProfilePage() {
  return (
    <ProtectedRoute>
      <HospitalProfileContent />
    </ProtectedRoute>
  );
}
