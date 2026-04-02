'use client';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { LogOut, User, Settings, CreditCard, Crown, Star } from 'lucide-react';
import { useAuth } from './auth-provider';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { PricingModal } from './pricing-modal';
import { track } from '@vercel/analytics';

export function UserMenu() {
  const { user, logout, loading, signInWithGoogle } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      setUserData(doc.data());
    });
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />;
  }

  if (!user) {
    return (
      <Button 
        onClick={() => {
          track('auth_sign_in_click', { provider: 'google' });
          signInWithGoogle();
        }} 
        variant="outline" 
        className="rounded-full px-6 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 font-medium group"
      >
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign In
        </div>
      </Button>
    );
  }

  return (
    <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
              <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            {userData?.isPremium && (
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5 border-2 border-background">
                <Crown className="h-3 w-3 fill-current" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              {userData?.isPremium && (
                <div className="flex items-center gap-1 text-[10px] text-primary font-bold mt-1 uppercase tracking-wider">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  Premium Member
                </div>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {!userData?.isPremium && (
            <DialogTrigger asChild>
              <DropdownMenuItem 
                className="cursor-pointer text-primary font-medium focus:text-primary"
                onClick={() => track('upgrade_pro_click', { source: 'user_menu' })}
              >
                <Crown className="mr-2 h-4 w-4 fill-current" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DialogTrigger>
          )}

          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => {
              track('auth_logout_click');
              logout();
            }} 
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DialogContent className="sm:max-w-[800px] p-0 border-none bg-transparent">
        <div className="bg-background rounded-xl p-6 shadow-2xl border">
          <PricingModal onClose={() => setIsPricingOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
