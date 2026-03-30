'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import type { ItineraryData, TripPreferences } from '@/types/trip';
import { TripPreferencesForm } from './trip-preferences-form';
import { ItineraryDisplay } from './itinerary-display';
import { getItinerary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Button } from './ui/button';
import { PanelLeftClose, PanelRightClose } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TripPlanner() {
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tripPrefs, setTripPrefs] = useState<TripPreferences | null>(null);
  const { toast } = useToast();
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);

  const { user, getIdToken } = useAuth();
  const router = useRouter();

  const handleFormSubmit = async (preferences: TripPreferences) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please sign in to generate an itinerary.",
      });
      return;
    }

    setIsLoading(true);
    setItineraryData(null);
    setTripPrefs(preferences);
    setIsFormCollapsed(true);

    try {
      const token = await getIdToken();
      if (!token) throw new Error("Failed to get auth token");

      const result = await getItinerary(preferences, token);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Oh no! Something went wrong.",
          description: result.error,
        });
        setItineraryData(null);
        setIsFormCollapsed(false);
      } else if (result.data && result.tripId) {
        setItineraryData(result.data);
        router.push(`/trip/${result.tripId}`);
      }
    } catch (error: any) {
       toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message || "An error occurred while authenticating.",
        });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className={cn("grid gap-12 transition-all duration-300", isFormCollapsed ? "lg:grid-cols-12" : "lg:grid-cols-5")}>
        <div className={cn("transition-all duration-300", isFormCollapsed ? "lg:col-span-0 hidden" : "lg:col-span-2")}>
            <TripPreferencesForm
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
            />
        </div>
        <div className={cn("transition-all duration-300", isFormCollapsed ? "lg:col-span-12" : "lg:col-span-3")}>
            {(itineraryData || isLoading) && (
              <Button
                variant="outline"
                size="icon"
                className="mb-4"
                onClick={() => setIsFormCollapsed(!isFormCollapsed)}
              >
                {isFormCollapsed ? <PanelRightClose /> : <PanelLeftClose />}
                <span className="sr-only">Toggle Form</span>
              </Button>
            )}
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
