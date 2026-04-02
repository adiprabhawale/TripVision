'use client';

import dynamic from 'next/dynamic';
import { LayoutShell } from './layout-shell';
import { TripDashboard } from './trip-dashboard';
import { useAuth } from './auth-provider';
import { Button } from './ui/button';
import { Globe, ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const TripPlanner = dynamic(() => import('@/components/trip-planner'), {
  ssr: false,
  loading: () => <div className="h-96 rounded-3xl bg-card/10 animate-pulse border border-border/50" />
});

export default function HomePageClient() {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <LayoutShell activeView="plan">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground animate-pulse font-medium">Preparing your departure...</p>
        </div>
      </LayoutShell>
    );
  }

  if (!user) {
    return (
      <LayoutShell activeView="plan">
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />
          
          <div className="relative z-10 text-center space-y-12 max-w-5xl px-6">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top duration-1000">
                <Globe className="w-3 h-3" />
                The Future of Travel Planning
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-headline font-bold tracking-tighter leading-[0.95] animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
                Plan Your Next <br />
                <span className="text-primary italic">Masterpiece</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
                TripVision combines AI intelligence with elite design to help you create unforgettable itineraries in seconds. Collaboration is just a click away.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
               <Button 
                 onClick={signInWithGoogle}
                 className="group relative h-16 md:h-20 px-10 md:px-14 rounded-[2.5rem] bg-primary text-primary-foreground font-bold text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300"
               >
                 Get Started for Free
                 <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
               </Button>
               <Button 
                 variant="ghost"
                 className="h-16 md:h-20 px-10 md:px-14 rounded-[2.5rem] border border-white/5 bg-white/5 hover:bg-white/10 font-bold text-xl backdrop-blur-md transition-all"
               >
                 Explore Destinations
               </Button>
            </div>

            {/* Feature Pills */}
            <div className="pt-12 flex flex-wrap justify-center gap-4 opacity-40 animate-in fade-in slide-in-from-bottom duration-1000 delay-700">
               <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 border border-border">
                 <Sparkles className="w-4 h-4 text-primary" />
                 <span className="text-xs font-bold uppercase tracking-wider">AI Driven</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 border border-border">
                 <Zap className="w-4 h-4 text-primary" />
                 <span className="text-xs font-bold uppercase tracking-wider">Real-time</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 border border-border">
                 <ShieldCheck className="w-4 h-4 text-primary" />
                 <span className="text-xs font-bold uppercase tracking-wider">Secure</span>
               </div>
            </div>
          </div>
        </div>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell activeView="plan">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-[1700px] mx-auto pb-20">
        {/* Left: Planning Column (Now Main Focus) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-12 animate-in fade-in slide-in-from-left duration-1000">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              AI Assisted Intelligence
            </div>
            <h1 className="text-6xl xl:text-8xl font-headline font-bold leading-tight tracking-tighter">
              Create Your Next <br />
              <span className="text-primary italic">Masterpiece</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl font-medium leading-relaxed">
              Design professional, collaborative itineraries in seconds. Every detail of your journey, refined by AI and styled for the elite traveler.
            </p>
          </div>
          
          <div className="bg-card/30 backdrop-blur-3xl p-1 rounded-[3rem] border border-white/5 shadow-2xl shadow-primary/5 ring-1 ring-white/5 overflow-hidden">
             <TripPlanner />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <Zap className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Instant Generation</h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                Our AI engine processes thousands of data points to build your logical route in under 30 seconds.
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-secondary/5 border border-secondary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <Globe className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Collaborative Hub</h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                Invite colleagues and friends to refine the itinerary in real-time with zero friction.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Dashboard Column (Sticky Sidebar) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-8 lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-1000 delay-200">
          <div className="flex items-end justify-between border-b border-border/50 pb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-headline font-bold uppercase tracking-tight">Recent <span className="text-primary italic">Plans</span></h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Management Console</p>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse mb-2" />
          </div>
          
          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
            <TripDashboard />
          </div>

          <div className="p-6 rounded-[2rem] bg-muted/20 border border-white/5 backdrop-blur-md">
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Want to see <b>archived trips</b>? The full archive is moving to the dedicated vault soon.
            </p>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}

