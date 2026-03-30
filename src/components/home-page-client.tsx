'use client';

import dynamic from 'next/dynamic';
import { MountainIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TripDashboard } from './trip-dashboard';

const TripPlanner = dynamic(() => import('@/components/trip-planner'), {
  ssr: false,
  loading: () => <div className="flex-1 flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
});

const UserMenu = dynamic(() => import('@/components/user-menu').then(mod => mod.UserMenu), {
  ssr: false,
  loading: () => <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
});

export default function HomePageClient() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="py-6 px-4 md:px-6 relative shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
                <MountainIcon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    TripVision
                </h1>
            </div>
            <UserMenu />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-8">
        <Tabs defaultValue="plan" className="w-full">
          <div className="flex justify-end mb-8">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-muted/50 p-1 rounded-full border border-primary/10">
              <TabsTrigger value="plan" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                Plan New Trip
              </TabsTrigger>
              <TabsTrigger value="my-trips" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                My Adventures
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="mt-2">
            <TabsContent value="plan" className="mt-0">
              <TripPlanner />
            </TabsContent>
            <TabsContent value="my-trips" className="mt-0">
              <TripDashboard />
            </TabsContent>
          </div>
        </Tabs>
      </main>
      <footer className="py-6 px-4 md:px-6 mt-16 border-t border-primary/5">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} TripVision. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
