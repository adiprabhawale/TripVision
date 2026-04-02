'use client';

import type { DailyPlan } from '@/types/trip';
import { ActivityVote } from './activity-vote';
import { Coins, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListViewProps {
  itinerary: DailyPlan[];
  tripId?: string;
}

export function ListView({ itinerary, tripId }: ListViewProps) {
  return (
    <div className="space-y-16 py-6 max-w-4xl mx-auto">
      {itinerary.map((day, index) => (
        <section key={day.day_number} className="relative pl-12 md:pl-20 group">
          {/* Vertical Line */}
          <div className="absolute left-5 md:left-9 top-2 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/5 to-transparent" />
          
          {/* Day Marker */}
          <div className="absolute left-0 md:left-4 top-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-headline font-bold text-xl shadow-lg shadow-primary/10 ring-4 ring-background group-hover:scale-105 transition-transform duration-500">
            {day.day_number}
          </div>
          
          <div className="mb-8 animate-in fade-in slide-in-from-left duration-700">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-1 block">PHASE {day.day_number}</span>
            <h3 className="text-3xl md:text-4xl font-headline font-bold tracking-tight">{day.theme}</h3>
            <div className="h-1 w-16 bg-primary mt-3 rounded-full opacity-60" />
          </div>

          <div className="space-y-6">
            {day.activities.map((activity, activityIndex) => (
              <div key={activity.id || activityIndex} className="relative animate-in fade-in slide-in-from-bottom duration-500 delay-150">
                {/* Connector Dot */}
                <div className="absolute -left-[45px] md:-left-[61px] top-7">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/40 ring-4 ring-background" />
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-start group/card">
                  <div className="min-w-[80px] pt-1.5 shrink-0">
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 py-0.5 px-2.5 rounded-full border border-primary/10 w-fit">
                      {activity.time}
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full p-6 rounded-2xl bg-card/30 backdrop-blur-3xl border border-white/5 hover:border-primary/20 transition-all duration-500 group-hover/card:bg-card/50 shadow-lg">
                     <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="space-y-2">
                          <p className="text-lg font-bold leading-snug tracking-tight">{activity.description}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white/5 rounded-full text-[9px] font-bold text-muted-foreground uppercase tracking-widest border border-white/5">
                               <Coins className="w-2.5 h-2.5 text-primary" />
                               {activity.estimated_cost}
                            </span>
                          </div>
                        </div>
                        {tripId && (
                          <div className="sm:pt-1">
                             <ActivityVote tripId={tripId} activityId={activity.id} />
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
