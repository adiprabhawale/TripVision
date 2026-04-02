'use client';

import React, { useState } from 'react';
import { useAuth } from './auth-provider';
import { CollaborationBar } from './collaboration-bar';
import { ItineraryDisplay } from './itinerary-display';
import { PackingList } from './packing-list';
import { LayoutShell } from './layout-shell';
import { TripPulse } from './trip-pulse';
import { Button } from './ui/button';
import { 
  Calendar, 
  Briefcase, 
  Wallet, 
  FileText,
  ChevronRight,
  Globe,
  Users,
  Shield,
  LogIn,
  MapPin
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TripPageClientProps {
  tripId: string;
  tripData: any;
}

export function TripPageClient({ tripId, tripData }: TripPageClientProps) {
  const { user, loading, signInWithGoogle } = useAuth();
  const [activeHubView, setActiveHubView] = useState<'itinerary' | 'packing' | 'budget' | 'docs' | 'pulse'>('itinerary');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground animate-pulse font-medium">Synchronizing your adventure...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-background">
        <Card className="max-w-md w-full border-primary/20 bg-card/30 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="h-3 bg-primary" />
          <CardHeader className="text-center pb-2 pt-10">
            <div className="mx-auto bg-primary/10 p-4 rounded-3xl w-fit mb-6 ring-8 ring-primary/5">
                <Users className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-4xl font-headline font-bold tracking-tight">Join the Adventure</CardTitle>
            <CardDescription className="text-lg px-4 mt-2">
                You&apos;ve been invited to collaborate on a trip to <span className="font-bold text-foreground italic">{tripData.preferences?.destination}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-10 pt-6">
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <Globe className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">Real-time collaborative planning</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <Shield className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">Secure access for contributors only</span>
                </div>
            </div>
            
            <Button 
                onClick={signInWithGoogle} 
                className="w-full gap-3 text-lg h-16 rounded-2xl font-bold bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
                <LogIn className="h-6 w-6" />
                Sign In with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hubNavItems = [
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'packing', label: 'Packing List', icon: Briefcase },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'docs', label: 'Documents', icon: FileText },
  ] as const;

  return (
    <LayoutShell activeView="itinerary-hub">
      <div className="flex gap-12 h-full items-start max-w-[1700px] mx-auto">
        {/* Inner Sidebar: Navigation */}
        <aside className="hidden xl:flex flex-col w-72 space-y-10 sticky top-0 animate-in fade-in slide-in-from-left duration-700">
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest bg-primary/5 border border-primary/10 rounded-full py-1 px-3 w-fit">
                <MapPin className="w-3 h-3" />
                HUB CONTROL
              </div>
              <h1 className="text-4xl font-headline font-bold leading-tight">
                {tripData.preferences?.destination || 'Trip Details'}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                <Calendar className="w-4 h-4" />
                {tripData.preferences?.startDate ? format(new Date(tripData.preferences.startDate), 'MMM dd') : 'Season'} • {tripData.preferences?.duration || 'Multi'} Days
              </p>
           </div>

           <nav className="space-y-2">
              {hubNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => setActiveHubView(item.id)}
                  className={cn(
                    "w-full justify-between h-14 px-6 rounded-2xl transition-all duration-300 font-bold tracking-wide group",
                    activeHubView === item.id 
                      ? "bg-primary text-primary-foreground shadow-xl shadow-primary/10" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-4 text-sm">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </span>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    activeHubView === item.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  )} />
                </Button>
              ))}
           </nav>

           <div className="pt-8 border-t border-border/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Collaborators</p>
              <CollaborationBar tripId={tripId} />
           </div>
        </aside>

        {/* Center: Main Timeline / Canvas */}
        <div className="flex-1 min-w-0 pb-20 animate-in fade-in slide-in-from-bottom transition-all duration-700">
           {activeHubView === 'itinerary' && (
              <ItineraryDisplay 
                  itineraryData={tripData as any} 
                  preferences={tripData.preferences} 
                  tripId={tripId} 
              />
           )}
           {activeHubView === 'packing' && (
              <div className="space-y-8">
                 <h2 className="text-4xl font-headline font-bold">Packing <span className="text-primary italic">Essentials</span></h2>
                 <PackingList tripId={tripId} />
              </div>
           )}
           {activeHubView === 'budget' && (
              <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-[3rem] bg-card/10 text-center p-12">
                 <Wallet className="h-16 w-16 text-muted-foreground/30 mb-6" />
                 <h2 className="text-2xl font-headline font-bold">Budget Tracker</h2>
                 <p className="text-muted-foreground mt-2 max-w-sm">Detailed expense tracking is coming soon. Use the Trip Pulse widget for the current overview.</p>
              </div>
           )}
            {activeHubView === 'docs' && (
              <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-[3rem] bg-card/10 text-center p-12">
                 <FileText className="h-16 w-16 text-muted-foreground/30 mb-6" />
                 <h2 className="text-2xl font-headline font-bold">Document Vault</h2>
                 <p className="text-muted-foreground mt-2 max-w-sm">Securely store your tickets, bookings, and IDs in the next update.</p>
              </div>
           )}
           {activeHubView === 'pulse' && (
              <div className="lg:hidden">
                 <TripPulse tripData={tripData} standalone />
              </div>
           )}
        </div>

        {/* Right Sidebar: Trip Pulse (Desktop Only) */}
        <TripPulse tripData={tripData} />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-card/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
        {hubNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveHubView(item.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all duration-300",
              activeHubView === item.id ? "bg-primary/20 text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => setActiveHubView('pulse')}
          className={cn(
            "flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all duration-300",
            activeHubView === 'pulse' ? "bg-primary/20 text-primary" : "text-muted-foreground"
          )}
        >
          <Globe className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Pulse</span>
        </button>
      </div>
    </LayoutShell>
  );
}

