'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { getUserTrips } from '@/app/trip-actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Calendar, ArrowRight, PlaneTakeoff, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function TripDashboard() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTripId, setLoadingTripId] = useState<string | null>(null);
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

  const handleViewItinerary = (tripId: string) => {
    setLoadingTripId(tripId);
    router.push(`/trip/${tripId}`);
  };

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
    <div className="flex flex-col gap-6">
      {trips.map((trip) => {
        return (
          <Card 
            key={trip.id} 
            className="group relative border-border/40 bg-card/10 backdrop-blur-3xl hover:border-primary/40 transition-all duration-700 overflow-hidden rounded-[2rem] flex flex-col h-auto"
          >
            {/* Subtle Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent transition-all duration-700 group-hover:from-primary/10 group-hover:to-secondary/5" />
            
            <CardHeader className="relative z-10 p-6 pb-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <div className="flex gap-1.5">
                      <span className="text-[8px] uppercase tracking-[0.2em] font-black px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded">Trip</span>
                      <span className="text-[8px] uppercase tracking-[0.2em] font-black px-1.5 py-0.5 bg-white/5 text-muted-foreground border border-white/5 rounded italic">Planned</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-muted-foreground/50 font-black text-[9px] uppercase tracking-tighter">
                     <Calendar className="h-2.5 w-2.5" />
                     {trip.startDate ? format(new Date(trip.startDate), 'MMM dd') : 'Soon'}
                   </div>
                </div>
                <CardTitle className="font-headline font-bold text-xl leading-tight group-hover:text-primary transition-colors duration-500">
                  {trip.destination}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10 px-6 pb-4">
               <p className="text-[10px] text-foreground/40 leading-relaxed font-bold uppercase tracking-widest">
                 {trip.duration} Days • {trip.source || 'Your Space'}
               </p>
            </CardContent>
            
            <CardFooter className="relative z-10 px-6 pb-6">
              <Button 
                  onClick={() => handleViewItinerary(trip.id)}
                  disabled={loadingTripId === trip.id}
                  className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-[9px] bg-white/5 border border-white/5 hover:bg-primary hover:text-white transition-all duration-500 h-11"
                  variant="ghost"
              >
                {loadingTripId === trip.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Enter Hub
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </CardFooter>

            {/* Subtle Gradient Spot */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </Card>
        );
      })}
    </div>
  );
}


