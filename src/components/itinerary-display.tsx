'use client';

import { useState } from 'react';
import type { ItineraryData, TripPreferences, TravelOption, StayOption } from '@/types/trip';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { 
  Plane, Train, Bus, Wallet, List, Map, ExternalLink, Ticket, Milestone, 
  BedDouble, Download, Calendar, Clock, Coins 
} from 'lucide-react';
import { ListView } from './list-view';
import { MapView } from './map-view';
import { Separator } from './ui/separator';
import { exportToPDF } from '@/lib/pdf-export';
import { toast } from '@/hooks/use-toast';

interface ItineraryDisplayProps {
  itineraryData: ItineraryData;
  preferences: TripPreferences;
  tripId?: string;
}

type ViewMode = 'list' | 'map';

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

export function ItineraryDisplay({ itineraryData, preferences, tripId }: ItineraryDisplayProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Your Trip from {preferences.source} to {preferences.destination}
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            An AI-crafted itinerary based on your preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => exportToPDF(itineraryData, preferences)}
            >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download PDF</span>
            </Button>
            <Separator orientation="vertical" className="h-8 mx-1 hidden sm:block" />
            <div className="flex bg-muted p-1 rounded-lg">
                <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="flex items-center gap-2 px-3"
                >
                    <List className="h-4 w-4" />
                    List
                </Button>
                <Button
                    variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className="flex items-center gap-2 px-3"
                >
                    <Map className="h-4 w-4" />
                    Map
                </Button>
            </div>
        </div>
      </div>

      <div className="space-y-8">

        {viewMode === 'list' ? (
          <ListView itinerary={itineraryData.itinerary} tripId={tripId} />
        ) : (
          <MapView
            itinerary={itineraryData.itinerary}
            stayOptions={itineraryData.stay_options}
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
            {itineraryData.budget_notes && (
                <CardDescription className="text-xs text-destructive pt-1">{itineraryData.budget_notes}</CardDescription>
            )}
            <p className="text-xs text-muted-foreground pt-1">
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
