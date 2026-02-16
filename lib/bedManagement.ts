import { Hospital } from './mockData';

export interface BedRequirement {
  careType: 'ER' | 'ICU' | 'trauma' | 'general' | 'pediatric';
  count: number;
}

/**
 * Get required bed department based on care type
 */
export const getBedDepartmentKey = (careType: string): keyof Hospital['beds'] => {
  const mapping: { [key: string]: keyof Hospital['beds'] } = {
    ICU: 'icu',
    trauma: 'trauma',
    ER: 'general',
    general: 'general',
    pediatric: 'pediatric',
  };
  return mapping[careType] || 'general';
};

/**
 * Check if hospital has available beds for the given care type and count
 */
export const hasAvailableBeds = (
  hospital: Hospital,
  careType: string,
  requiredBeds: number
): boolean => {
  // Validate hospital has beds structure
  if (!hospital.beds || typeof hospital.beds !== 'object') {
    return false;
  }
  
  const departmentKey = getBedDepartmentKey(careType);
  const department = hospital.beds[departmentKey];
  
  // Validate department exists and has available property
  if (!department || typeof department.available !== 'number') {
    return false;
  }
  
  return department.available >= requiredBeds;
};

/**
 * Get occupancy status label
 */
export const getOccupancyStatus = (occupancyRate: number): 'low' | 'moderate' | 'high' | 'critical' => {
  if (occupancyRate < 30) return 'low';
  if (occupancyRate < 60) return 'moderate';
  if (occupancyRate < 85) return 'high';
  return 'critical';
};

/**
 * Get occupancy status color
 */
export const getOccupancyColor = (
  status: 'low' | 'moderate' | 'high' | 'critical'
): string => {
  const colors = {
    low: 'hsl(var(--status-stable))',
    moderate: 'hsl(var(--accent))',
    high: 'hsl(var(--status-warning))',
    critical: 'hsl(var(--primary))',
  };
  return colors[status];
};

/**
 * Get occupancy status label text
 */
export const getOccupancyLabel = (
  status: 'low' | 'moderate' | 'high' | 'critical'
): string => {
  const labels = {
    low: 'Low occupancy',
    moderate: 'Moderate occupancy',
    high: 'High occupancy',
    critical: 'Critical occupancy',
  };
  return labels[status];
};

/**
 * Get all available beds for a specific care type
 */
export const getAvailableBedsByType = (
  hospital: Hospital,
  careType: string
): number => {
  // Validate hospital has beds structure
  if (!hospital.beds || typeof hospital.beds !== 'object') {
    return 0;
  }
  
  const departmentKey = getBedDepartmentKey(careType);
  const department = hospital.beds[departmentKey];
  
  // Validate department exists and has available property
  if (!department || typeof department.available !== 'number') {
    return 0;
  }
  
  return department.available;
};

/**
 * Calculate suitability score for a hospital based on available beds, distance, and load
 */
export const calculateHospitalSuitability = (
  hospital: Hospital,
  requiredBeds: number,
  careType: string,
  distance: number
): number => {
  let score = 100;

  // Bed availability (40 points)
  const availableBeds = getAvailableBedsByType(hospital, careType);
  const bedScore = Math.min(40, requiredBeds > 0 ? (availableBeds / requiredBeds) * 40 : 40);
  score += bedScore;

  // Distance penalty (up to -30 points)
  const distancePenalty = Math.min(30, distance > 0 ? (distance / 10) * 30 : 0);
  score -= distancePenalty;

  // ER Load penalty (up to -20 points)
  const erLoad = hospital.erLoad || 0;
  const loadPenalty = (erLoad / 100) * 20;
  score -= loadPenalty;

  // Status bonus
  if (hospital.status === 'stable') {
    score += 15;
  } else if (hospital.status === 'high-load') {
    score -= 10;
  } else if (hospital.status === 'critical') {
    score -= 25;
  }

  return Math.max(0, score);
};
