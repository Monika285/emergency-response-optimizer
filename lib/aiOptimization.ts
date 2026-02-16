import { Hospital, Accident } from './mockData';

export interface OptimizationResult {
  recommendedHospital: Hospital;
  confidence: number;
  reasoning: string[];
  estimatedArrival: number;
  estimatedBedAvailability: number;
  timeToGoldenWindow: number; // minutes remaining in golden window
}

export const optimizeHospitalRoute = (
  hospitals: Hospital[],
  accident: Accident,
  trafficDensity: number
): OptimizationResult => {
  // Normalize traffic impact (0-100 slider to 1-2x multiplier)
  const trafficMultiplier = 1 + (trafficDensity / 100) * 1;

  // Calculate scores for each hospital
  const scores = hospitals.map((hospital) => {
    let score = 100;
    const reasoning: string[] = [];

    // Distance/Travel Time Scoring (30 points max)
    const travelTime = (hospital.travelTime || 15) * trafficMultiplier;
    const distanceScore = Math.max(0, 30 - travelTime * 1.5);
    score += distanceScore;
    if (travelTime < 10) {
      reasoning.push(`Fast arrival time: ${Math.round(travelTime)} minutes`);
    }

    // ICU Bed Availability (25 points max)
    const icuBeds = hospital.beds?.icu;
    const icuAvailabilityScore = icuBeds ? (icuBeds.available / icuBeds.total) * 25 : 0;
    score += icuAvailabilityScore;
    if (icuBeds && icuBeds.available > 5) {
      reasoning.push(`Strong ICU capacity: ${icuBeds.available}/${icuBeds.total} beds available`);
    }

    // ER Load Scoring (25 points max - lower load is better)
    const erLoadScore = Math.max(0, 25 - (hospital.erLoad / 100) * 25);
    score += erLoadScore;
    if (hospital.erLoad < 50) {
      reasoning.push(`Low ER congestion: ${hospital.erLoad}% load`);
    }

    // Oxygen Supply (20 points max)
    const oxygenScore = (hospital.oxygenSupply / 100) * 20;
    score += oxygenScore;
    if (hospital.oxygenSupply > 85) {
      reasoning.push(`Adequate oxygen reserves: ${hospital.oxygenSupply}%`);
    }

    return { hospital, score, reasoning };
  });

  // Sort by score and get top recommendation
  const sorted = scores.sort((a, b) => b.score - a.score);
  const recommended = sorted[0];

  const estimatedArrival = Math.round((recommended.hospital.travelTime || 15) * trafficMultiplier);
  const icuBedsAvailable = recommended.hospital.beds?.icu?.available || 0;
  const estimatedBedAvailability = Math.max(
    0,
    icuBedsAvailable - Math.ceil(accident.patientCount * 1.2)
  );

  // Golden window = 10 minutes (critical treatment window)
  const timeToGoldenWindow = Math.max(0, 10 - estimatedArrival);

  return {
    recommendedHospital: recommended.hospital,
    confidence: Math.round((recommended.score / 200) * 100),
    reasoning: recommended.reasoning,
    estimatedArrival,
    estimatedBedAvailability,
    timeToGoldenWindow,
  };
};
