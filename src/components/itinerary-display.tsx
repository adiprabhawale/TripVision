'use client';

import { useState } from 'react';
import type { ItineraryData, TripPreferences } from '@/types/trip';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Ticket, List, CalendarDays } from 'lucide-react';
import { ListView } from './list-view';
import { CalendarView } from './calendar-view';

interface ItineraryDisplayProps {
  itineraryData: ItineraryData;
  preferences: TripPreferences;
}

type ViewMode = 'list' | 'calendar';

export function ItineraryDisplay({ itineraryData, preferences }: ItineraryDisplayProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          Your Trip to {preferences.destination}
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          An AI-crafted itinerary based on your preferences.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Budget Forecast</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {itineraryData.budget_forecast}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Travel Availability</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {itineraryData.travel_availability}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <List className="mr-2 h-4 w-4" />
            List View
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
        </div>

        {viewMode === 'list' ? (
          <ListView itinerary={itineraryData.itinerary} />
        ) : (
          <CalendarView
            itinerary={itineraryData.itinerary}
            startDate={preferences.startDate}
            duration={parseInt(preferences.duration)}
          />
        )}
      </div>
    </div>
  );
}
