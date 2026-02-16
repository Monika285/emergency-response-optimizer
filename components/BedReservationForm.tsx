'use client';

import { useState } from 'react';
import { Hospital } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { X, CheckCircle } from 'lucide-react';

interface BedReservationFormProps {
  hospital: Hospital;
  careType: string;
  onSubmit: (reservation: any) => void;
  onCancel: () => void;
}

export function BedReservationForm({
  hospital,
  careType,
  onSubmit,
  onCancel,
}: BedReservationFormProps) {
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [patientCount, setPatientCount] = useState(1);
  const [selectedBedCount, setSelectedBedCount] = useState(1);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReserve = async () => {
    if (!patientName.trim() || !contactNumber.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    const reservation = {
      id: 'RES-' + Date.now(),
      patientName,
      contactNumber,
      patientCount,
      bedCount: selectedBedCount,
      careType,
      notes: additionalNotes,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
    };

    onSubmit(reservation);
    setIsSubmitting(false);
  };

  // Get available beds for the care type
  const getDepartmentKey = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'ER': 'general',
      'ICU': 'icu',
      'trauma': 'trauma',
      'General': 'general',
    };
    return typeMap[type] || 'general';
  };

  const deptKey = getDepartmentKey(careType);
  const department = hospital.beds?.[deptKey as keyof typeof hospital.beds];
  const availableBeds = department?.available || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Confirm Bed Reservation</h2>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Hospital Info */}
        <div className="bg-muted/30 rounded-lg p-4 mb-6 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Selected Hospital</p>
          <p className="text-lg font-semibold text-foreground">{hospital.name}</p>
          <p className="text-sm text-muted-foreground mt-1">{hospital.address}</p>
          <p className="text-sm text-primary font-medium mt-2">Available {careType} Beds: {availableBeds}</p>
        </div>

        {/* Reservation Details */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Care Type</label>
            <div className="px-3 py-2 bg-input border border-border rounded-md text-foreground">
              {careType}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Patient Name *
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name"
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Contact Number *
            </label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter contact number"
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Number of Patients
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPatientCount(Math.max(1, patientCount - 1))}
                className="px-3 py-2 bg-input border border-border rounded hover:bg-input/80"
              >
                −
              </button>
              <span className="text-2xl font-bold text-primary min-w-[50px] text-center">
                {patientCount}
              </span>
              <button
                onClick={() => setPatientCount(patientCount + 1)}
                className="px-3 py-2 bg-input border border-border rounded hover:bg-input/80"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Number of Beds Needed *
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedBedCount(Math.max(1, selectedBedCount - 1))}
                className="px-3 py-2 bg-input border border-border rounded hover:bg-input/80"
              >
                −
              </button>
              <span className="text-2xl font-bold text-primary min-w-[50px] text-center">
                {selectedBedCount}
              </span>
              <button
                onClick={() => setSelectedBedCount(Math.min(availableBeds, selectedBedCount + 1))}
                className="px-3 py-2 bg-input border border-border rounded hover:bg-input/80"
                disabled={selectedBedCount >= availableBeds}
              >
                +
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Maximum available: {availableBeds} beds
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Additional Notes (Optional)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any special medical requirements..."
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
              rows={3}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReserve}
            disabled={isSubmitting || !patientName.trim() || !contactNumber.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {isSubmitting ? 'Reserving...' : 'Confirm & Get Receipt'}
          </Button>
        </div>
      </div>
    </div>
  );
}
