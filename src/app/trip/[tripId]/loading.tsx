'use client';

import { Globe } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150 opacity-20" />
        <div className="bg-primary/10 p-4 rounded-2xl relative">
          <Globe className="h-10 w-10 text-primary animate-pulse" />
        </div>
      </div>
      <div className="mt-8 text-center space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Preparing Your TripVision</h2>
        <p className="text-muted-foreground animate-pulse">Syncing itinerary details...</p>
      </div>
      <div className="mt-12 flex gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
      </div>
    </div>
  );
}
