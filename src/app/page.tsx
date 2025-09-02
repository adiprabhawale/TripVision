import TripPlanner from '@/components/trip-planner';
import { MountainIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="py-6 px-4 md:px-6">
        <div className="container mx-auto flex items-center justify-center gap-2">
            <MountainIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-center text-primary-foreground font-headline tracking-tight sm:text-4xl">
                TripVision
            </h1>
        </div>
        <p className="text-center text-muted-foreground mt-2 max-w-2xl mx-auto">
            Your personal AI travel assistant. Craft detailed, day-by-day itineraries in seconds.
        </p>
      </header>
      <main className="flex-1">
        <TripPlanner />
      </main>
      <footer className="py-6 px-4 md:px-6 mt-16">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} TripVision. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
