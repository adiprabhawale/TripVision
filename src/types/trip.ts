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
  budget_forecast: string;
  travel_availability: string;
}

export interface TripPreferences {
    destination: string;
    startDate: Date;
    duration: string;
    budget: string;
    interests: string;
}
