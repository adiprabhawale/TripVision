'use client';

import type { DailyPlan, StayOption } from '@/types/trip';
import { Card } from './ui/card';
import Image from 'next/image';

interface MapViewProps {
  itinerary: DailyPlan[];
  stayOptions: StayOption[];
}

export function MapView({ itinerary, stayOptions }: MapViewProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Map View</h3>
      <div className="relative h-96 w-full bg-muted rounded-md flex items-center justify-center">
        <Image
            src="https://picsum.photos/800/600"
            alt="Map placeholder"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
            data-ai-hint="map city"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
            <p className="text-white text-center p-4">
                Map integration is not yet available. This is a placeholder for where the map would be.
            </p>
        </div>
      </div>
      <div className='mt-4'>
        <h4 className="font-semibold">Locations to Visit:</h4>
        <ul className='list-disc list-inside'>
        {itinerary.flatMap(day => day.activities).map((activity, index) => (
            <li key={`activity-${index}`}>
                {activity.description} 
                {activity.location && ` (${activity.location.latitude}, ${activity.location.longitude})`}
            </li>
        ))}
        </ul>
        <h4 className="font-semibold mt-2">Suggested Stays:</h4>
        <ul className='list-disc list-inside'>
        {stayOptions.map((stay, index) => (
            <li key={`stay-${index}`}>
                {stay.name}
                {stay.location && ` (${stay.location.latitude}, ${stay.location.longitude})`}
            </li>
        ))}
        </ul>
      </div>
    </Card>
  );
}
