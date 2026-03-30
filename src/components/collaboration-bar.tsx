'use client';

import { useAuth } from './auth-provider';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  serverTimestamp, 
  deleteDoc 
} from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { 
  UserPlus, 
  Link as LinkIcon, 
  Mail, 
  MessageCircle,
  Copy,
  Check,
  Users
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useToast } from '@/hooks/use-toast';

export function CollaborationBar({ tripId }: { tripId: string }) {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !tripId) return;

    const presenceRef = doc(db, 'trips', tripId, 'presence', user.uid);
    
    // Set presence
    setDoc(presenceRef, {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastSeen: serverTimestamp(),
    });

    // Listen for others
    const q = query(collection(db, 'trips', tripId, 'presence'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data());
      // Filter out stale users (e.g., > 1 minute)
      const now = Date.now();
      const filteredUsers = users.filter(u => {
          if (!u.lastSeen) return true;
          const lastSeen = u.lastSeen.toDate?.()?.getTime() || now;
          return now - lastSeen < 60000;
      });
      setActiveUsers(filteredUsers);
    });

    // Cleanup presence on unmount
    return () => {
      unsubscribe();
      deleteDoc(presenceRef);
    };
  }, [user, tripId]);

  const inviteLink = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast({
        title: "Link Copied!",
        description: "Share it with your friends to start collaborating.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Hey! Join me in planning our next trip on TripVision: ${inviteLink}`)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent('Join my trip on TripVision')}&body=${encodeURIComponent(`Hey! I\'m using TripVision to plan a trip. Join me here: ${inviteLink}`)}`;

  return (
    <div className="flex items-center gap-4">
      <div className="flex -space-x-2 overflow-hidden">
        <TooltipProvider>
          {activeUsers.map((u) => (
            <Tooltip key={u.uid}>
              <TooltipTrigger asChild>
                <Avatar className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                  <AvatarImage src={u.photoURL} alt={u.displayName} />
                  <AvatarFallback>{u.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{u.displayName} {u.uid === user?.uid && '(You)'}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/20 hover:border-primary/50 bg-background/50 backdrop-blur-sm shadow-sm transition-all duration-300">
            <UserPlus className="h-4 w-4" />
            Invite
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-6" align="end" sideOffset={8}>
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-bold text-lg leading-none flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Invite Friends
              </h4>
              <p className="text-sm text-muted-foreground">
                Collaborate in real-time on this itinerary.
              </p>
            </div>
            
            <div className="space-y-4 pt-2 border-t border-primary/10">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invite Link</label>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-primary/5">
                  <LinkIcon className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                  <span className="text-[11px] truncate flex-1 font-mono">{inviteLink}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10" onClick={handleCopyLink}>
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="gap-2 rounded-lg h-9 hover:bg-green-500/5 hover:border-green-500/30 group" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                    WhatsApp
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="gap-2 rounded-lg h-9 hover:bg-blue-500/5 hover:border-blue-500/30 group" asChild>
                  <a href={emailUrl}>
                    <Mail className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {activeUsers.length > 1 && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 animate-in slide-in-from-right-4 duration-500">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-primary uppercase tracking-tighter">
                {activeUsers.length} Active Now
            </span>
        </div>
      )}
    </div>
  );
}
