'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHospitals } from '@/hooks/useHospitals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, Plus, Minus } from 'lucide-react';

interface FormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  emergencyContact: string;
  totalCapacity: number;
  currentPatients: number;
  beds: {
    icu: number;
    trauma: number;
    general: number;
    pediatric: number;
  };
  availableBeds: {
    icu: number;
    trauma: number;
    general: number;
    pediatric: number;
  };
}

const DEFAULT_COORDINATES = { lat: 40.7128, lng: -74.006 };

export default function RegisterHospitalPage() {
  const router = useRouter();
  const { registerHospital } = useHospitals();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    emergencyContact: '',
    totalCapacity: 0,
    currentPatients: 0,
    beds: {
      icu: 0,
      trauma: 0,
      general: 0,
      pediatric: 0,
    },
    availableBeds: {
      icu: 0,
      trauma: 0,
      general: 0,
      pediatric: 0,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('total') || name.includes('current') ? parseInt(value) || 0 : value,
    }));
  };

  const handleBedChange = (type: keyof typeof formData.beds, amount: number) => {
    setFormData((prev) => ({
      ...prev,
      beds: {
        ...prev.beds,
        [type]: Math.max(0, prev.beds[type] + amount),
      },
    }));
  };

  const handleAvailableBedChange = (type: keyof typeof formData.availableBeds, amount: number) => {
    setFormData((prev) => ({
      ...prev,
      availableBeds: {
        ...prev.availableBeds,
        [type]: Math.max(0, Math.min(prev.beds[type], prev.availableBeds[type] + amount)),
      },
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Hospital name is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.phone.trim()) return 'Phone is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.emergencyContact.trim()) return 'Emergency contact is required';

    const totalBeds = Object.values(formData.beds).reduce((a, b) => a + b, 0);
    if (totalBeds === 0) return 'At least one bed type must be available';

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      registerHospital({
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        emergencyContact: formData.emergencyContact,
        totalCapacity: formData.totalCapacity || Object.values(formData.beds).reduce((a, b) => a + b, 0),
        currentPatients: formData.currentPatients,
        totalBeds: formData.beds,
        availableBeds: formData.availableBeds,
        coordinates: DEFAULT_COORDINATES,
        status: 'active',
      });

      setSuccess(true);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        emergencyContact: '',
        totalCapacity: 0,
        currentPatients: 0,
        beds: { icu: 0, trauma: 0, general: 0, pediatric: 0 },
        availableBeds: { icu: 0, trauma: 0, general: 0, pediatric: 0 },
      });

      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err) {
      setError('Failed to register hospital. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Register Your Hospital</h1>
          <p className="text-muted-foreground">
            Join the Golden 10 network and manage real-time bed availability
          </p>
        </div>

        {success && (
          <Card className="mb-6 bg-green-500/10 border-green-500/30 p-4">
            <p className="text-green-400 font-medium">Hospital registered successfully! Redirecting...</p>
          </Card>
        )}

        {error && (
          <Card className="mb-6 bg-destructive/10 border-destructive/30 p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-destructive">{error}</p>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Information */}
            <Card className="p-8 border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Hospital Name *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="St. Mary's Medical Center"
                    className="bg-muted/30 border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@hospital.com"
                    className="bg-muted/30 border-border"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Address *</label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Medical Avenue, City, State 12345"
                    className="bg-muted/30 border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(212) 555-0123"
                    className="bg-muted/30 border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Emergency Contact *</label>
                  <Input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Dr. John Smith"
                    className="bg-muted/30 border-border"
                  />
                </div>
              </div>
            </Card>

            {/* Capacity Information */}
            <Card className="p-8 border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-6">Hospital Capacity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Patients Admitted
                  </label>
                  <Input
                    type="number"
                    name="currentPatients"
                    value={formData.currentPatients}
                    onChange={handleInputChange}
                    min="0"
                    className="bg-muted/30 border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Total Hospital Capacity
                  </label>
                  <Input
                    type="number"
                    name="totalCapacity"
                    value={formData.totalCapacity}
                    onChange={handleInputChange}
                    min="0"
                    className="bg-muted/30 border-border"
                  />
                </div>
              </div>
            </Card>

            {/* Bed Management */}
            <Card className="p-8 border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-6">Bed Availability by Department</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {['icu', 'trauma', 'general', 'pediatric'].map((type) => (
                  <div
                    key={type}
                    className="border border-border rounded-lg p-6 bg-muted/20"
                  >
                    <h3 className="text-lg font-semibold text-foreground capitalize mb-4">{type} Ward</h3>

                    {/* Total Beds */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Total Beds: <span className="text-primary font-bold">{formData.beds[type as keyof typeof formData.beds]}</span>
                      </label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleBedChange(type as keyof typeof formData.beds, -1)}
                          className="flex-1"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleBedChange(type as keyof typeof formData.beds, 1)}
                          className="flex-1"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Available Beds */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Available Now:{' '}
                        <span className="text-secondary font-bold">
                          {formData.availableBeds[type as keyof typeof formData.availableBeds]}
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAvailableBedChange(type as keyof typeof formData.availableBeds, -1)
                          }
                          className="flex-1"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAvailableBedChange(type as keyof typeof formData.availableBeds, 1)
                          }
                          className="flex-1"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Occupied: {formData.beds[type as keyof typeof formData.beds] - formData.availableBeds[type as keyof typeof formData.availableBeds]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 text-lg h-12"
              >
                {isLoading ? 'Registering...' : 'Register Hospital'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 text-lg h-12"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
