'use client';

import { useState } from 'react';
import type { ItineraryData, TripPreferences, TravelOption } from '@/types/trip';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Plane, Train, Bus, Wallet, List, CalendarDays } from 'lucide-react';
import { ListView } from './list-view';
import { CalendarView } from './calendar-view';

interface ItineraryDisplayProps {
  itineraryData: ItineraryData;
  preferences: TripPreferences;
}

type ViewMode = 'list' | 'calendar';

const TravelOptionIcon = ({ type }: { type: TravelOption['type'] }) => {
    switch (type) {
      case 'Flight':
        return <Plane className="h-5 w-5 text-primary" />;
      case 'Train':
        return <Train className="h-5 w-5 text-primary" />;
      case 'Bus':
        return <Bus className="h-5 w-5 text-primary" />;
      default:
        return null;
    }
  };

export function ItineraryDisplay({ itineraryData, preferences }: ItineraryDisplayProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          Your Trip from {preferences.source} to {preferences.destination}
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          An AI-crafted itinerary based on your preferences.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {itineraryData.total_budget}
            </p>
            <p className="text-xs text-muted-foreground">
              Estimated total for {preferences.numberOfPeople} person(s)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Travel Options</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
                {itineraryData.travel_options.map((option, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <TravelOptionIcon type={option.type} />
                        <div>
                            <p className="font-semibold text-sm">{option.type}</p>
                            <p className="text-sm text-muted-foreground">{option.details}</p>
                        </div>
                    </div>
                ))}
             </div>
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
