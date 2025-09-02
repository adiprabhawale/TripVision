'use client';

import type { DailyPlan } from '@/types/trip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card } from './ui/card';

interface ListViewProps {
  itinerary: DailyPlan[];
}

export function ListView({ itinerary }: ListViewProps) {
  return (
    <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-2">
      {itinerary.map((day, index) => (
        <AccordionItem value={`item-${index}`} key={day.day_number} className="border-b-0">
          <Card>
            <AccordionTrigger className="px-6 text-lg font-semibold hover:no-underline">
              Day {day.day_number}: {day.theme}
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <ul className="space-y-4">
                {day.activities.map((activity, activityIndex) => (
                  <li key={activityIndex} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="font-semibold text-sm w-20 text-center">{activity.time}</div>
                      <div className="flex-grow w-px bg-border my-1"></div>
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Est. Cost: {activity.estimated_cost}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </Card>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
