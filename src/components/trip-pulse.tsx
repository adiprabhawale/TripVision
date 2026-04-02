import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Cloud, Wallet, CheckSquare, AlertCircle, Plane, 
  BedDouble, MapPin, Navigation, ExternalLink, Globe,
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface TripPulseProps {
  tripData?: any;
  standalone?: boolean;
}

export function TripPulse({ tripData, standalone = false }: TripPulseProps) {
  const [activeTab, setActiveTab] = useState<'pulse' | 'stay' | 'travel'>('pulse');
  const [currency, setCurrency] = useState('USD');
  const [locationName, setLocationName] = useState('Global');

  useEffect(() => {
    try {
      const detectCurrency = Intl.NumberFormat().resolvedOptions().currency || 'USD';
      setCurrency(detectCurrency);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const city = timeZone.split('/')[1]?.replace('_', ' ') || 'Nearby';
      setLocationName(city);
    } catch (e) {
      console.error("Locales detection failed", e);
    }
  }, []);

  const budgetStats = useMemo(() => {
    if (!tripData?.itinerary) return { actual: 0, target: tripData?.preferences?.budget || 0, percent: 0 };
    
    let total = 0;
    tripData.itinerary.forEach((day: any) => {
      day.activities?.forEach((act: any) => {
        const cost = parseFloat(act.estimated_cost?.replace(/[^0-9.]/g, '')) || 0;
        total += cost;
      });
    });

    const target = tripData.preferences?.budget || 50000;
    const percent = target > 0 ? Math.min(Math.round((total / target) * 100), 100) : 0;
    
    return { actual: total, target, percent };
  }, [tripData]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  const tabs = [
    { id: 'pulse', label: 'Pulse', icon: Globe },
    { id: 'stay', label: 'Stay', icon: BedDouble },
    { id: 'travel', label: 'Travel', icon: Plane },
  ] as const;

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden relative",
      standalone 
        ? "w-full bg-transparent" 
        : "hidden lg:flex w-[400px] border-l border-border/40 bg-card/10 backdrop-blur-3xl"
    )}>
      {/* Tab Navigation */}
      <div className="flex p-4 border-b border-border/40 bg-background/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all duration-300 relative group",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className={cn("w-5 h-5 transition-transform duration-300", activeTab === tab.id ? "scale-110" : "group-hover:scale-110")} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(148,204,255,0.8)]" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 animate-in fade-in duration-500">
        {activeTab === 'pulse' && (
          <>
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-2xl font-headline font-bold">Trip <span className="text-primary italic">Pulse</span></h2>
              <div className="flex flex-col items-end">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[9px] text-muted-foreground mt-1 uppercase tracking-widest font-bold">Live Context</span>
              </div>
            </div>

            {/* Weather Widget */}
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-none rounded-3xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                      <MapPin className="w-3 h-3" />
                      {tripData?.preferences?.destination || locationName}
                    </div>
                    <div>
                      <p className="text-5xl font-headline font-bold tracking-tighter">22°C</p>
                      <p className="text-xs text-muted-foreground font-medium mt-1">Perfect for exploration</p>
                    </div>
                  </div>
                  <Cloud className="w-12 h-12 text-primary/20 group-hover:text-primary/40 transition-colors duration-700" />
                </div>
              </CardContent>
            </Card>

            {/* Real-time Budget Widget */}
            <Card className="bg-card/40 border-border/40 rounded-3xl overflow-hidden">
               <CardContent className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
                      <Wallet className="w-3 h-3" />
                      Live Budget
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                      {budgetStats.percent}% Used
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-4xl font-headline font-bold tracking-tighter">
                      {formatCurrency(budgetStats.actual)}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      Estimate per {tripData?.preferences?.budgetType || 'person'} • Goal: {formatCurrency(budgetStats.target)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Progress value={budgetStats.percent} className="h-1.5 bg-muted/30" />
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      <span>Start</span>
                      <span>Target Reach</span>
                    </div>
                  </div>

                  {budgetStats.percent > 80 && (
                    <div className="p-3 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex gap-3">
                      <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
                      <p className="text-[10px] leading-relaxed text-orange-200/70 font-medium">
                        Heads up! You're approaching your budget limit. Review stay options for potential savings.
                      </p>
                    </div>
                  )}
               </CardContent>
            </Card>

            {/* Check-in Notification */}
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex gap-4 group cursor-pointer hover:bg-primary/10 transition-all">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                 <Navigation className="w-5 h-5" />
               </div>
               <div className="flex-1">
                 <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Adventure Intel</p>
                 <p className="text-xs text-muted-foreground leading-relaxed font-medium">Your next activity starts in <span className="text-foreground font-bold">2 hours</span>. Tap for directions.</p>
               </div>
            </div>
          </>
        )}

        {activeTab === 'stay' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold">Stay <span className="text-primary italic">Sanctuary</span></h2>
            <div className="space-y-4">
              {tripData?.stay_options?.map((option: any, i: number) => (
                <Card key={i} className="bg-card/40 border-border/40 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{option.name}</h3>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">{option.type}</p>
                      </div>
                      <p className="text-xl font-bold font-headline text-primary">{option.price_per_night}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{option.details}</p>
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl h-10 text-[10px] font-bold uppercase tracking-widest border-white/5 hover:bg-primary hover:text-white transition-all gap-2 group-hover:translate-y-[-2px]"
                      onClick={() => option.bookingLink && window.open(option.bookingLink, '_blank')}
                    >
                      View Details <ExternalLink className="w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {(!tripData?.stay_options || tripData.stay_options.length === 0) && (
                <p className="text-center text-muted-foreground py-10 italic">No stay options found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'travel' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold">Logistics <span className="text-primary italic">Hub</span></h2>
            <div className="space-y-4">
              {tripData?.travel_options?.map((option: any, i: number) => (
                <Card key={i} className="bg-card/40 border-border/40 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all">
                   <CardContent className="p-5 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Plane className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm leading-tight">{option.name}</h3>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-[10px] uppercase font-bold text-primary tracking-widest">{option.type}</p>
                            <p className="text-lg font-bold font-headline">{option.fare}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{option.details}</p>
                      <Button 
                        className="w-full rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold h-10 text-[10px] uppercase tracking-widest transition-all"
                        onClick={() => option.bookingLink && window.open(option.bookingLink, '_blank')}
                      >
                        Secure Booking
                      </Button>
                   </CardContent>
                </Card>
              ))}
              {(!tripData?.travel_options || tripData.travel_options.length === 0) && (
                <p className="text-center text-muted-foreground py-10 italic">No travel options found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
