'use client';

import { useState } from 'react';
import type { ItineraryData, TripPreferences } from '@/types/trip';
import { TripPreferencesForm } from './trip-preferences-form';
import { ItineraryDisplay } from './itinerary-display';
import { getItinerary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function TripPlanner() {
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tripPrefs, setTripPrefs] = useState<TripPreferences | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (preferences: TripPreferences) => {
    setIsLoading(true);
    setItineraryData(null);
    setTripPrefs(preferences);

    const result = await getItinerary(preferences);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: result.error,
      });
      setItineraryData(null);
    } else if (result.data) {
      setItineraryData(result.data);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
            <TripPreferencesForm
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
            />
        </div>
        <div className="lg:col-span-3">
            {itineraryData && tripPrefs ? (
                <ItineraryDisplay itineraryData={itineraryData} preferences={tripPrefs} />
            ) : (
                <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center bg-card">
                    {isLoading ? (
                        <div>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Generating your personalized adventure...</p>
                        </div>
                    ) : (
                       <>
                         <div className="w-full max-w-md">
                           <Image
                             src="https://picsum.photos/600/400"
                             alt="A scenic travel destination"
                             width={600}
                             height={400}
                             className="rounded-lg object-cover"
                             data-ai-hint="travel landscape"
                           />
                         </div>
                         <h3 className="mt-6 text-2xl font-semibold">Your Itinerary Awaits</h3>
                         <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                           Fill out your travel preferences, and our AI will create a custom trip plan just for you.
                         </p>
                       </>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
