'use client';

import { useState } from 'react';
import type { ItineraryData, TripPreferences, TravelOption, StayOption } from '@/types/trip';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plane, Train, Bus, Wallet, List, CalendarDays, ExternalLink, Ticket, Milestone, BedDouble } from 'lucide-react';
import { ListView } from './list-view';
import { CalendarView } from './calendar-view';
import { Separator } from './ui/separator';

interface ItineraryDisplayProps {
  itineraryData: ItineraryData;
  preferences: TripPreferences;
}

type ViewMode = 'list' | 'calendar';

const TravelOptionIcon = ({ type }: { type: TravelOption['type'] }) => {
    switch (type) {
      case 'Flight':
        return <Plane className="h-6 w-6 text-primary" />;
      case 'Train':
        return <Train className="h-6 w-6 text-primary" />;
      case 'Bus':
        return <Bus className="h-6 w-6 text-primary" />;
      case 'Connecting':
        return <Milestone className="h-6 w-6 text-primary" />;
      default:
        return <Ticket className="h-6 w-6 text-primary" />;
    }
  };

const StayOptionIcon = () => {
    return <BedDouble className="h-6 w-6 text-primary" />;
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

      <div className="space-y-8">
        <div className="flex items-center gap-2">
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
      
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-normal">
              {itineraryData.total_budget}
            </p>
            <p className="text-xs text-muted-foreground">
              For {preferences.numberOfPeople} person(s)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Travel Options</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {itineraryData.travel_options.map((option, index) => (
                    <div key={index}>
                      <div className="flex items-start gap-4">
                          <TravelOptionIcon type={option.type} />
                          <div className="flex-1">
                              <div className="flex justify-between items-start">
                                  <div>
                                      <p className="font-semibold">{option.name}</p>
                                      <p className="text-sm text-muted-foreground">{option.details}</p>
                                  </div>
                                  <p className="font-semibold text-lg whitespace-nowrap pl-4">{option.fare}</p>
                              </div>
                              <Button asChild variant="link" className="px-0 h-auto mt-1">
                                <a href={option.bookingLink} target="_blank" rel="noopener noreferrer">
                                  Book Now <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                              </Button>
                          </div>
                      </div>
                      {index < itineraryData.travel_options.length - 1 && <Separator className="mt-4" />}
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Stay Options</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {itineraryData.stay_options.map((option, index) => (
                    <div key={index}>
                      <div className="flex items-start gap-4">
                          <StayOptionIcon />
                          <div className="flex-1">
                              <div className="flex justify-between items-start">
                                  <div>
                                      <p className="font-semibold">{option.name} <span className="text-sm font-normal text-muted-foreground">({option.type})</span></p>
                                      <p className="text-sm text-muted-foreground">{option.details}</p>
                                  </div>
                                  <p className="font-semibold text-lg whitespace-nowrap pl-4">{option.price_per_night}</p>
                              </div>
                              <Button asChild variant="link" className="px-0 h-auto mt-1">
                                <a href={option.bookingLink} target="_blank" rel="noopener noreferrer">
                                  Book Now <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                              </Button>
                          </div>
                      </div>
                      {index < itineraryData.stay_options.length - 1 && <Separator className="mt-4" />}
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
