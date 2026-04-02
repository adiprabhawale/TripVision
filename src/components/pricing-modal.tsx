'use client';

import { useState } from 'react';
import { useAuth } from './auth-provider';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Check, Zap, Crown } from 'lucide-react';
import { upgradeToPremium } from '@/app/payment-actions';
import { useToast } from '@/hooks/use-toast';

export function PricingModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) return;
    setLoading(true);
    
    // Simulate Razorpay checkout delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await upgradeToPremium(user.uid);
    if (result.success) {
      toast({
        title: "Welcome to TripVision Pro!",
        description: "You now have unlimited access to all features.",
      });
      onClose();
    } else {
        toast({
            variant: "destructive",
            title: "Upgrade failed",
            description: result.error,
        });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold font-headline">Upgrade to Pro</h2>
        <p className="text-muted-foreground">Unlock the full power of TripVision</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-muted">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Perfect for trial</CardDescription>
            <div className="text-3xl font-bold mt-2">$0 <span className="text-lg font-normal text-muted-foreground">/mo</span></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              1 AI Trip every 24 hours
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              Basic Itinerary
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 opacity-50" />
              No PDF Export
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Current Plan</Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
            POPULAR
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Crown className="h-5 w-5 fill-current" />
              Pro
            </CardTitle>
            <CardDescription>For serious travelers</CardDescription>
            <div className="text-3xl font-bold mt-2">$9.99 <span className="text-lg font-normal text-muted-foreground">/mo</span></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Zap className="h-4 w-4 text-primary fill-current" />
              Unlimited AI Trips
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              Priority AI Generation
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              Professional PDF Export
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              Early access to new features
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleUpgrade} disabled={loading}>
              {loading ? "Processing..." : "Upgrade Now"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
