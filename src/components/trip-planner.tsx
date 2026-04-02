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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
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
      } else if (result.data && result.tripId) {
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
    <TripPreferencesForm
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
    />
  );
}

