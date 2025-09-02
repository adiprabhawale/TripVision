export interface Activity {
  time: string;
  description: string;
  estimated_cost: string;
}

export interface DailyPlan {
  day_number: number;
  theme: string;
  activities: Activity[];
}

export interface ItineraryData {
  itinerary: DailyPlan[];
  total_budget: string;
  travel_options: string;
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
    interests: string;
}
