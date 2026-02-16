export interface BedDepartment {
  name: string;
  total: number;
  available: number;
  occupied: number;
  occupancyRate: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number };
  phone: string;
  beds: {
    icu: BedDepartment;
    trauma: BedDepartment;
    general: BedDepartment;
    pediatric: BedDepartment;
  };
  oxygenSupply: number;
  erLoad: number;
  status: 'stable' | 'high-load' | 'critical';
  distance?: number;
  travelTime?: number;
}

export interface Accident {
  id: string;
  location: string;
  severity: 'minor' | 'moderate' | 'critical';
  careType: 'ER' | 'ICU' | 'trauma';
  patientCount: number;
  coordinates: { lat: number; lng: number };
}

export const mockHospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'Apollo Hospital Delhi',
    location: 'Sarita Vihar, Delhi',
    address: '101 Mathura Road, Sarita Vihar, Delhi 110076',
    coordinates: { lat: 28.5355, lng: 77.2410 },
    phone: '+91-11-4166-1111',
    beds: {
      icu: { name: 'ICU', total: 50, available: 12, occupied: 38, occupancyRate: 76 },
      trauma: { name: 'Trauma', total: 35, available: 8, occupied: 27, occupancyRate: 77 },
      general: { name: 'General', total: 150, available: 35, occupied: 115, occupancyRate: 77 },
      pediatric: { name: 'Pediatric', total: 40, available: 10, occupied: 30, occupancyRate: 75 },
    },
    oxygenSupply: 85,
    erLoad: 72,
    status: 'high-load',
  },
  {
    id: 'h2',
    name: 'Fortis Hospital Mumbai',
    location: 'Andheri East, Mumbai',
    address: '154 LBS Road, Andheri East, Mumbai 400069',
    coordinates: { lat: 19.1136, lng: 72.8697 },
    phone: '+91-22-6803-6000',
    beds: {
      icu: { name: 'ICU', total: 45, available: 28, occupied: 17, occupancyRate: 38 },
      trauma: { name: 'Trauma', total: 30, available: 20, occupied: 10, occupancyRate: 33 },
      general: { name: 'General', total: 120, available: 45, occupied: 75, occupancyRate: 63 },
      pediatric: { name: 'Pediatric', total: 35, available: 18, occupied: 17, occupancyRate: 49 },
    },
    oxygenSupply: 92,
    erLoad: 45,
    status: 'stable',
  },
  {
    id: 'h3',
    name: 'Max Super Specialty Hospital Bangalore',
    location: 'Vasantkunj, Bangalore',
    address: '11 Golf Course Road, Vasantkunj, Bangalore 560052',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    phone: '+91-80-4658-4658',
    beds: {
      icu: { name: 'ICU', total: 60, available: 8, occupied: 52, occupancyRate: 87 },
      trauma: { name: 'Trauma', total: 40, available: 5, occupied: 35, occupancyRate: 88 },
      general: { name: 'General', total: 180, available: 25, occupied: 155, occupancyRate: 86 },
      pediatric: { name: 'Pediatric', total: 45, available: 6, occupied: 39, occupancyRate: 87 },
    },
    oxygenSupply: 78,
    erLoad: 88,
    status: 'critical',
  },
  {
    id: 'h4',
    name: 'AIIMS New Delhi',
    location: 'Ansari Nagar, Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, Delhi 110029',
    coordinates: { lat: 28.5677, lng: 77.2009 },
    phone: '+91-11-2658-8500',
    beds: {
      icu: { name: 'ICU', total: 40, available: 35, occupied: 5, occupancyRate: 13 },
      trauma: { name: 'Trauma', total: 25, available: 22, occupied: 3, occupancyRate: 12 },
      general: { name: 'General', total: 100, available: 65, occupied: 35, occupancyRate: 35 },
      pediatric: { name: 'Pediatric', total: 30, available: 25, occupied: 5, occupancyRate: 17 },
    },
    oxygenSupply: 95,
    erLoad: 30,
    status: 'stable',
  },
  {
    id: 'h5',
    name: 'Lilavati Hospital & Research Centre',
    location: 'Bandra Reclamation, Mumbai',
    address: 'A-791 Lilavati, Bandra Reclamation, Mumbai 400050',
    coordinates: { lat: 19.0596, lng: 72.8295 },
    phone: '+91-22-2430-5000',
    beds: {
      icu: { name: 'ICU', total: 55, available: 22, occupied: 33, occupancyRate: 60 },
      trauma: { name: 'Trauma', total: 32, available: 15, occupied: 17, occupancyRate: 53 },
      general: { name: 'General', total: 140, available: 50, occupied: 90, occupancyRate: 64 },
      pediatric: { name: 'Pediatric', total: 38, available: 16, occupied: 22, occupancyRate: 58 },
    },
    oxygenSupply: 88,
    erLoad: 58,
    status: 'stable',
  },
  {
    id: 'h6',
    name: 'Apollo Gleneagles Hospital Kolkata',
    location: 'Salt Lake City, Kolkata',
    address: '58 Canal South Road, Salt Lake City, Kolkata 700091',
    coordinates: { lat: 22.5355, lng: 88.3794 },
    phone: '+91-33-4004-4404',
    beds: {
      icu: { name: 'ICU', total: 48, available: 18, occupied: 30, occupancyRate: 63 },
      trauma: { name: 'Trauma', total: 32, available: 12, occupied: 20, occupancyRate: 63 },
      general: { name: 'General', total: 130, available: 40, occupied: 90, occupancyRate: 69 },
      pediatric: { name: 'Pediatric', total: 36, available: 14, occupied: 22, occupancyRate: 61 },
    },
    oxygenSupply: 89,
    erLoad: 65,
    status: 'high-load',
  },
  {
    id: 'h7',
    name: 'Ruby General Hospital Kolkata',
    location: 'Alipore, Kolkata',
    address: '147 Syed Amir Ali Avenue, Alipore, Kolkata 700027',
    coordinates: { lat: 22.5198, lng: 88.3627 },
    phone: '+91-33-4050-5050',
    beds: {
      icu: { name: 'ICU', total: 40, available: 30, occupied: 10, occupancyRate: 25 },
      trauma: { name: 'Trauma', total: 28, available: 18, occupied: 10, occupancyRate: 36 },
      general: { name: 'General', total: 110, available: 50, occupied: 60, occupancyRate: 55 },
      pediatric: { name: 'Pediatric', total: 30, available: 15, occupied: 15, occupancyRate: 50 },
    },
    oxygenSupply: 93,
    erLoad: 42,
    status: 'stable',
  },
  {
    id: 'h8',
    name: 'AMRI Hospitals Kolkata',
    location: 'Salt Lake City, Kolkata',
    address: 'JC-16 & 17, Salt Lake City, Sector I, Kolkata 700064',
    coordinates: { lat: 22.5445, lng: 88.4450 },
    phone: '+91-33-6652-3333',
    beds: {
      icu: { name: 'ICU', total: 52, available: 25, occupied: 27, occupancyRate: 52 },
      trauma: { name: 'Trauma', total: 34, available: 14, occupied: 20, occupancyRate: 59 },
      general: { name: 'General', total: 145, available: 55, occupied: 90, occupancyRate: 62 },
      pediatric: { name: 'Pediatric', total: 38, available: 17, occupied: 21, occupancyRate: 55 },
    },
    oxygenSupply: 91,
    erLoad: 58,
    status: 'stable',
  },
  {
    id: 'h9',
    name: 'Peerless Hospital & B.K. Roy Research Centre',
    location: 'Kolkata',
    address: '360 Acharya Jagadish Chandra Bose Road, Kolkata 700020',
    coordinates: { lat: 22.5453, lng: 88.3603 },
    phone: '+91-33-2206-2000',
    beds: {
      icu: { name: 'ICU', total: 44, available: 20, occupied: 24, occupancyRate: 55 },
      trauma: { name: 'Trauma', total: 30, available: 11, occupied: 19, occupancyRate: 63 },
      general: { name: 'General', total: 125, available: 38, occupied: 87, occupancyRate: 70 },
      pediatric: { name: 'Pediatric', total: 34, available: 12, occupied: 22, occupancyRate: 65 },
    },
    oxygenSupply: 87,
    erLoad: 62,
    status: 'high-load',
  },
  {
    id: 'h10',
    name: 'The Calcutta Medical Research Institute',
    location: 'Kolkata',
    address: '206 AJC Bose Road, Kolkata 700014',
    coordinates: { lat: 22.5517, lng: 88.3705 },
    phone: '+91-33-2213-5000',
    beds: {
      icu: { name: 'ICU', total: 36, available: 28, occupied: 8, occupancyRate: 22 },
      trauma: { name: 'Trauma', total: 24, available: 16, occupied: 8, occupancyRate: 33 },
      general: { name: 'General', total: 95, available: 42, occupied: 53, occupancyRate: 56 },
      pediatric: { name: 'Pediatric', total: 28, available: 14, occupied: 14, occupancyRate: 50 },
    },
    oxygenSupply: 94,
    erLoad: 38,
    status: 'stable',
  },
  {
    id: 'h11',
    name: 'Disha Hospitals Burdwan',
    location: 'Burdwan City, West Bengal',
    address: '123 Bidhan Sarani, Burdwan, West Bengal 713101',
    coordinates: { lat: 23.2400, lng: 87.3065 },
    phone: '+91-342-252-0000',
    beds: {
      icu: { name: 'ICU', total: 30, available: 15, occupied: 15, occupancyRate: 50 },
      trauma: { name: 'Trauma', total: 22, available: 10, occupied: 12, occupancyRate: 55 },
      general: { name: 'General', total: 85, available: 32, occupied: 53, occupancyRate: 62 },
      pediatric: { name: 'Pediatric', total: 24, available: 10, occupied: 14, occupancyRate: 58 },
    },
    oxygenSupply: 85,
    erLoad: 54,
    status: 'stable',
  },
  {
    id: 'h12',
    name: 'Burdwan Medical College Hospital',
    location: 'Burdwan, West Bengal',
    address: 'College Road, Burdwan, West Bengal 713104',
    coordinates: { lat: 23.2336, lng: 87.3214 },
    phone: '+91-342-255-3000',
    beds: {
      icu: { name: 'ICU', total: 45, available: 32, occupied: 13, occupancyRate: 29 },
      trauma: { name: 'Trauma', total: 28, available: 18, occupied: 10, occupancyRate: 36 },
      general: { name: 'General', total: 115, available: 52, occupied: 63, occupancyRate: 55 },
      pediatric: { name: 'Pediatric', total: 32, available: 18, occupied: 14, occupancyRate: 44 },
    },
    oxygenSupply: 92,
    erLoad: 41,
    status: 'stable',
  },
  {
    id: 'h13',
    name: 'Metro Hospital Burdwan',
    location: 'Burdwan, West Bengal',
    address: '456 Station Road, Burdwan, West Bengal 713102',
    coordinates: { lat: 23.2450, lng: 87.3100 },
    phone: '+91-342-256-4000',
    beds: {
      icu: { name: 'ICU', total: 32, available: 20, occupied: 12, occupancyRate: 38 },
      trauma: { name: 'Trauma', total: 24, available: 14, occupied: 10, occupancyRate: 42 },
      general: { name: 'General', total: 95, available: 40, occupied: 55, occupancyRate: 58 },
      pediatric: { name: 'Pediatric', total: 28, available: 13, occupied: 15, occupancyRate: 54 },
    },
    oxygenSupply: 88,
    erLoad: 48,
    status: 'stable',
  },
];

export const calculateDistance = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number => {
  // Simplified distance calculation (in km)
  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getHospitalsWithDistance = (
  fromCoordinates: { lat: number; lng: number },
  hospitalsToUse: Hospital[] = mockHospitals
): Hospital[] => {
  return hospitalsToUse.map((hospital) => ({
    ...hospital,
    distance: calculateDistance(fromCoordinates, hospital.coordinates),
    travelTime: Math.ceil(calculateDistance(fromCoordinates, hospital.coordinates) * 2), // 2 min per km estimate
  }));
};
