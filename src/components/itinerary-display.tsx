'use client';

import { useState } from 'react';
import type { ItineraryData, TripPreferences, TravelOption, StayOption } from '@/types/trip';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { 
  Plane, Train, Bus, Wallet, List, Map, ExternalLink, Ticket, Milestone, 
  BedDouble, Download, Calendar, Clock, Coins, Globe, MapPin, ChevronRight
} from 'lucide-react';
import { ListView } from './list-view';
import { MapView } from './map-view';
import { Separator } from './ui/separator';
import { exportToPDF } from '@/lib/pdf-export';
import { cn } from '@/lib/utils';

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
    <div className="space-y-12 pb-10 max-w-5xl mx-auto">
      {/* Compact Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em] bg-primary/5 border border-primary/10 rounded-full py-1 px-3 w-fit">
             <Globe className="w-3 h-3" />
             AI CRAFTED JOURNEY
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter font-headline leading-none">
             <span className="text-primary/40 italic font-light block text-2xl mb-2 font-body tracking-normal">Journey to</span>
             {preferences.destination}
          </h2>
          <p className="text-sm text-muted-foreground font-medium max-w-md">
            Your bespoke adventure from <span className="text-foreground italic">{preferences.source}</span> is refined and ready.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <Button 
                variant="outline" 
                size="sm" 
                className="h-11 px-5 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all font-bold text-[10px] uppercase tracking-widest gap-2"
                onClick={() => exportToPDF(itineraryData, preferences)}
            >
                <Download className="h-4 w-4 text-primary" />
                PDF
            </Button>
            
            <div className="flex bg-card/60 backdrop-blur-xl p-1 rounded-xl border border-white/5 shadow-xl">
                <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "h-9 px-4 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all duration-300",
                      viewMode === 'list' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Timeline
                </Button>
                <Button
                    variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className={cn(
                      "h-9 px-4 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all duration-300",
                      viewMode === 'map' ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Map
                </Button>
            </div>
        </div>
      </div>

      <div className="transition-all duration-700 min-h-[50vh]">
        {viewMode === 'list' ? (
          <ListView itinerary={itineraryData.itinerary} tripId={tripId} />
        ) : (
          <MapView
            itinerary={itineraryData.itinerary}
            stayOptions={itineraryData.stay_options}
          />
        )}
      </div>
    </div>
  );
}
