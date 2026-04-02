export interface Location {
    latitude: number;
    longitude: number;
}

export interface Activity {
  id: string;
  time: string;
  description: string;
  estimated_cost: string;
  location?: Location;
}

export interface DailyPlan {
  day_number: number;
  theme: string;
  activities: Activity[];
}

export interface TravelOption {
    type: 'Flight' | 'Train' | 'Bus' | 'Connecting';
    name: string;
    fare: string;
    bookingLink: string;
    details: string;
}

export interface StayOption {
    name: string;
    type: string;
    price_per_night: string;
    bookingLink: string;
    details: string;
    location?: Location;
}

export interface ItineraryData {
  itinerary: DailyPlan[];
  total_budget: string;
  budget_notes?: string;
  travel_options: TravelOption[];
  stay_options: StayOption[];
}

export interface TripPreferences {
    source: string;
    destination: string;
    startDate: Date;
    duration: string;
    numberOfPeople: string;
    budgetType: 'per-person' | 'group';
    budget: number;
    travelType: string;
    stayType: string;
    interests: string;
}
