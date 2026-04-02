'use client';

import React, { useState } from 'react';
import { useAuth } from './auth-provider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Search, 
  Settings, 
  LogOut, 
  Menu,
  Plus,
  History,
  LayoutDashboard,
  Compass,
  Bell,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutShellProps {
  children: React.ReactNode;
  activeView?: 'plan' | 'adventures' | 'itinerary' | 'itinerary-hub';
}

export function LayoutShell({ children, activeView = 'plan' }: LayoutShellProps) {
  const { user, logout, signInWithGoogle, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { id: 'plan', label: 'Plan New Trip', icon: Plus, href: '/' },
    // { id: 'adventures', label: 'My Adventures', icon: History, href: '/' },
    // { id: 'explore', label: 'Explore', icon: Compass, href: '#' },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-body">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-20 border-r border-border bg-card/30 backdrop-blur-xl z-50">
        <div className="flex items-center justify-center h-20">
          <Link href="/">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 hover:scale-110 transition-transform duration-300">
              <span className="font-headline font-bold text-xl italic">V</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 flex flex-col items-center py-8 space-y-8">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-12 h-12 rounded-2xl transition-all duration-300",
                  pathname === item.href && activeView === item.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground font-bold"
                )}
                title={item.label}
              >
                <item.icon className="w-6 h-6" />
              </Button>
            </Link>
          ))}
        </nav>

        <div className="pb-8 flex flex-col items-center space-y-6">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="w-6 h-6" />
          </Button>
          {user && (
            <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={logout}>
              <LogOut className="w-6 h-6" />
            </Button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] md:hidden">
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-6 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <span className="font-headline font-bold text-2xl italic text-primary tracking-tighter">TripVision</span>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <Link key={item.id} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-4 px-4 py-6 rounded-xl",
                      pathname === item.href && activeView === item.id 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground font-bold"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-border flex flex-col gap-2">
              <Button variant="ghost" className="justify-start gap-4 text-muted-foreground">
                <Settings className="w-5 h-5" /> Settings
              </Button>
              {user && (
                <Button variant="ghost" className="justify-start gap-4 text-muted-foreground" onClick={logout}>
                  <LogOut className="w-5 h-5" /> Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Framework */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 flex items-center justify-between px-6 md:px-12 bg-background/50 backdrop-blur-md sticky top-0 z-40 border-b border-border/50">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
            
            {/* Branding */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300 md:hidden xl:flex">
                <span className="font-headline font-bold text-lg italic">V</span>
              </div>
              <span className="font-headline font-bold text-2xl tracking-tighter text-foreground hidden sm:block">
                Trip<span className="text-primary italic">Vision</span>
              </span>
            </Link>

            {user && (
              <div className="hidden lg:flex items-center bg-muted/50 rounded-full px-4 py-2 border border-border w-72 xl:w-96 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                <Input 
                  placeholder="Search destinations, trips..." 
                  className="bg-transparent border-none focus-visible:ring-0 h-8 p-0 text-sm placeholder:text-muted-foreground/60 w-full" 
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!loading && (
              user ? (
                <>
                  <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                  </Button>
                  <div className="flex items-center gap-3 pl-2 border-l border-border h-8 ml-2">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold">{user.displayName || 'Traveler'}</p>
                      <p className="text-[10px] text-muted-foreground font-bold">PREMIUM</p>
                    </div>
                    <Avatar className="w-10 h-10 ring-2 ring-primary/20 border-2 border-card">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </div>
                </>
              ) : (
                <Button 
                  onClick={signInWithGoogle}
                  className="rounded-full bg-primary text-primary-foreground font-bold px-8 h-12 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Sign In
                </Button>
              )
            )}
          </div>
        </header>

        {/* Viewport Content */}
        <section className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar p-6 md:p-12">
          {children}
        </section>
      </main>
    </div>
  );
}
