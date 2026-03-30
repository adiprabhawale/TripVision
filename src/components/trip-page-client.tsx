'use client';

import { useAuth } from './auth-provider';
import { CollaborationBar } from './collaboration-bar';
import { ItineraryDisplay } from './itinerary-display';
import { PackingList } from './packing-list';
import { Button } from './ui/button';
import { LogIn, Globe, Users, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

interface TripPageClientProps {
  tripId: string;
  tripData: any;
}

export function TripPageClient({ tripId, tripData }: TripPageClientProps) {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground animate-pulse">Loading your itinerary...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <Card className="max-w-md w-full border-primary/20 shadow-2xl overflow-hidden">
          <div className="h-2 bg-primary group-hover:bg-primary/80 transition-colors" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Join the Adventure</CardTitle>
            <CardDescription className="text-base">
                You've been invited to collaborate on a trip to <span className="font-semibold text-foreground">{tripData.preferences?.destination}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4 text-primary shrink-0" />
                    <span>Real-time collaborative planning</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary shrink-0" />
                    <span>Secure access for contributors only</span>
                </div>
            </div>
            
            <Button 
                onClick={signInWithGoogle} 
                className="w-full gap-2 text-lg h-12 rounded-full font-semibold shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
                <LogIn className="h-5 w-5" />
                Sign In with Google to Join
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-4 px-4 md:px-6 border-b sticky top-0 bg-background z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                  <Globe className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold font-headline tracking-tight">TripVision</h1>
          </div>
          <CollaborationBar tripId={tripId} />
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ItineraryDisplay 
                itineraryData={tripData as any} 
                preferences={tripData.preferences} 
                tripId={tripId} 
            />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">Live Collaboration Active</span>
            </div>
            <PackingList tripId={tripId} />
          </div>
        </div>
      </main>
    </div>
  );
}
