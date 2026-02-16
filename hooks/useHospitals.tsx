'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface HospitalBeds {
  icu: number;
  trauma: number;
  general: number;
  pediatric: number;
}

export interface RegisteredHospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  totalCapacity: number;
  currentPatients: number;
  availableBeds: HospitalBeds;
  totalBeds: HospitalBeds;
  emergencyContact: string;
  coordinates: { lat: number; lng: number };
  registeredAt: string;
  lastUpdated: string;
  status: 'active' | 'inactive';
}

interface HospitalsContextType {
  hospitals: RegisteredHospital[];
  registerHospital: (hospital: Omit<RegisteredHospital, 'id' | 'registeredAt' | 'lastUpdated'>) => void;
  updateHospitalBeds: (hospitalId: string, availableBeds: HospitalBeds) => void;
  updateCurrentPatients: (hospitalId: string, count: number) => void;
  getHospitalById: (id: string) => RegisteredHospital | undefined;
  deleteHospital: (id: string) => void;
  isLoading: boolean;
}

const HospitalsContext = createContext<HospitalsContextType | undefined>(undefined);

export function HospitalsProvider({ children }: { children: ReactNode }) {
  const [hospitals, setHospitals] = useState<RegisteredHospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load hospitals from localStorage on mount
  useEffect(() => {
    const savedHospitals = localStorage.getItem('registered_hospitals');
    if (savedHospitals) {
      try {
        setHospitals(JSON.parse(savedHospitals));
      } catch (error) {
        console.error('Failed to load hospitals:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save hospitals to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('registered_hospitals', JSON.stringify(hospitals));
    }
  }, [hospitals, isLoading]);

  const registerHospital = (hospital: Omit<RegisteredHospital, 'id' | 'registeredAt' | 'lastUpdated'>) => {
    const newHospital: RegisteredHospital = {
      ...hospital,
      id: `hosp_${Date.now()}`,
      registeredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setHospitals((prev) => [...prev, newHospital]);
  };

  const updateHospitalBeds = (hospitalId: string, availableBeds: HospitalBeds) => {
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === hospitalId
          ? {
              ...h,
              availableBeds,
              lastUpdated: new Date().toISOString(),
            }
          : h
      )
    );
  };

  const updateCurrentPatients = (hospitalId: string, count: number) => {
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === hospitalId
          ? {
              ...h,
              currentPatients: count,
              lastUpdated: new Date().toISOString(),
            }
          : h
      )
    );
  };

  const getHospitalById = (id: string) => {
    return hospitals.find((h) => h.id === id);
  };

  const deleteHospital = (id: string) => {
    setHospitals((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <HospitalsContext.Provider
      value={{
        hospitals,
        registerHospital,
        updateHospitalBeds,
        updateCurrentPatients,
        getHospitalById,
        deleteHospital,
        isLoading,
      }}
    >
      {children}
    </HospitalsContext.Provider>
  );
}

export function useHospitals() {
  const context = useContext(HospitalsContext);
  if (context === undefined) {
    throw new Error('useHospitals must be used within HospitalsProvider');
  }
  return context;
}
