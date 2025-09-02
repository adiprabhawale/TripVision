'use client';

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  addDays,
  isWithinInterval,
} from 'date-fns';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { DailyPlan, Activity } from '@/types/trip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface CalendarViewProps {
  itinerary: DailyPlan[];
  startDate: Date;
  duration: number;
}

export function CalendarView({ itinerary, startDate, duration }: CalendarViewProps) {
  const monthToDisplay = startOfMonth(startDate);

  const daysInMonth = useMemo(() => {
    const start = startOfWeek(monthToDisplay);
    const end = endOfWeek(endOfMonth(monthToDisplay));
    return eachDayOfInterval({ start, end });
  }, [monthToDisplay]);

  const itineraryMap = useMemo(() => {
    const map = new Map<string, DailyPlan>();
    itinerary.forEach((dayPlan) => {
      const date = addDays(startDate, dayPlan.day_number - 1);
      map.set(format(date, 'yyyy-MM-dd'), dayPlan);
    });
    return map;
  }, [itinerary, startDate]);

  const tripInterval = {
    start: startDate,
    end: addDays(startDate, duration - 1),
  };

  const DayDialog = ({ day, plan }: { day: Date; plan: DailyPlan }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Badge
          variant="default"
          className="w-full truncate cursor-pointer hover:bg-primary/80 text-xs p-1"
        >
          {plan.theme}
        </Badge>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Day {plan.day_number}: {plan.theme}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{format(day, 'EEEE, MMMM d')}</p>
        </DialogHeader>
        <ul className="space-y-4 mt-4">
          {plan.activities.map((activity, activityIndex) => (
            <li key={activityIndex} className="flex gap-4">
                <div className="font-semibold text-sm text-right w-16 pt-1">{activity.time}</div>
                <div className="flex-1 border-l-2 border-border pl-4">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                        Est. Cost: {activity.estimated_cost}
                    </p>
                </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{format(monthToDisplay, 'MMMM yyyy')}</h3>
      </div>
      <div className="grid grid-cols-7 gap-px text-center text-sm font-medium text-muted-foreground">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {daysInMonth.map((day) => {
          const dayPlan = itineraryMap.get(format(day, 'yyyy-MM-dd'));
          const isTripDay = isWithinInterval(day, tripInterval);

          return (
            <div
              key={day.toString()}
              className={cn(
                'relative h-28 p-2 border border-transparent rounded-md transition-colors',
                isSameMonth(day, monthToDisplay) ? 'bg-card' : 'bg-muted/50',
                isTripDay && 'bg-primary/10',
                isSameDay(day, new Date()) && 'border-accent'
              )}
            >
              <time
                dateTime={format(day, 'yyyy-MM-dd')}
                className={cn(
                  'text-sm',
                  !isSameMonth(day, monthToDisplay) && 'text-muted-foreground/50'
                )}
              >
                {format(day, 'd')}
              </time>
              {dayPlan && (
                <div className="mt-1">
                  <DayDialog day={day} plan={dayPlan} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
