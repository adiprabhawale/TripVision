'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { getUserTrips } from '@/app/trip-actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Calendar, ArrowRight, PlaneTakeoff, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function TripDashboard() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, getIdToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchTrips() {
      if (!user) return;
      try {
        const token = await getIdToken();
        if (token) {
          const result = await getUserTrips(token);
          if (result.trips) {
            setTrips(result.trips);
          }
        }
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrips();
  }, [user, getIdToken]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-card/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse">Loading your adventures...</p>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-card/50 text-center">
        <PlaneTakeoff className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold">No trips found</h3>
        <p className="text-muted-foreground mt-2 max-w-xs">
          You haven't planned any trips yet. Start your first adventure!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {trips.map((trip) => (
        <Card key={trip.id} className="group hover:shadow-lg transition-all duration-300 border-primary/10 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                  {trip.destination}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {trip.startDate ? format(new Date(trip.startDate), 'MMM do, yyyy') : 'No date set'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-sm text-muted-foreground">
                {trip.duration} Day Adventure
            </div>
          </CardContent>
          <CardFooter className="bg-primary/5 pt-3">
            <Button 
                onClick={() => router.push(`/trip/${trip.id}`)}
                className="w-full group" 
                variant="ghost"
            >
              View Itinerary
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
