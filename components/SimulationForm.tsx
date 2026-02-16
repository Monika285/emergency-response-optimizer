'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap } from 'lucide-react';

export interface SimulationInput {
  location: string;
  severity: 'minor' | 'moderate' | 'critical';
  careType: 'ER' | 'ICU' | 'trauma';
  patientCount: number;
}

interface SimulationFormProps {
  onSubmit: (data: SimulationInput) => void;
  isLoading?: boolean;
}

export function SimulationForm({ onSubmit, isLoading }: SimulationFormProps) {
  const [formData, setFormData] = useState<SimulationInput>({
    location: 'Downtown Intersection',
    severity: 'critical',
    careType: 'ICU',
    patientCount: 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="location" className="text-foreground">
          Accident Location
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Enter intersection or address"
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="severity" className="text-foreground">
            Severity Level
          </Label>
          <select
            id="severity"
            value={formData.severity}
            onChange={(e) =>
              setFormData({
                ...formData,
                severity: e.target.value as 'minor' | 'moderate' | 'critical',
              })
            }
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
          >
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="careType" className="text-foreground">
            Care Type
          </Label>
          <select
            id="careType"
            value={formData.careType}
            onChange={(e) =>
              setFormData({
                ...formData,
                careType: e.target.value as 'ER' | 'ICU' | 'trauma',
              })
            }
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
          >
            <option value="ER">Emergency Room</option>
            <option value="ICU">ICU</option>
            <option value="trauma">Trauma Center</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="patientCount" className="text-foreground">
          Patient Count: {formData.patientCount}
        </Label>
        <Input
          id="patientCount"
          type="number"
          min="1"
          max="10"
          value={formData.patientCount}
          onChange={(e) =>
            setFormData({ ...formData, patientCount: parseInt(e.target.value) })
          }
          className="bg-input border-border text-foreground"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isLoading ? (
          <>
            <Zap className="w-4 h-4 mr-2 animate-pulse" />
            Optimizing Route...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Run Simulation
          </>
        )}
      </Button>
    </form>
  );
}
