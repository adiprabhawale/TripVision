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
  Users,
  Wifi
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
    <div className="flex items-center gap-6">
      <div className="flex -space-x-3 overflow-hidden">
        <TooltipProvider>
          {activeUsers.map((u) => (
            <Tooltip key={u.uid}>
              <TooltipTrigger asChild>
                <div className="relative group/avatar cursor-help">
                  <Avatar className="h-10 w-10 border-4 border-background ring-1 ring-white/10 hover:ring-primary/50 hover:scale-110 hover:z-10 transition-all duration-500 shadow-xl">
                    <AvatarImage src={u.photoURL} alt={u.displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{u.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background shadow-lg ring-1 ring-black/20" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover/80 backdrop-blur-xl border-white/10 p-3 rounded-xl shadow-2xl">
                <p className="font-bold text-xs tracking-wide">{u.displayName} {u.uid === user?.uid && '(You)'}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Currently Editing</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button size="lg" className="h-12 px-6 rounded-2xl gap-3 bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300">
            <UserPlus className="h-4 w-4" />
            Invite
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-8 bg-card/60 backdrop-blur-3xl border-white/5 shadow-2xl rounded-[2.5rem]" align="end" sideOffset={12}>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
                 <Users className="w-3 h-3" />
                 CO-PLANNING
              </div>
              <h4 className="text-3xl font-headline font-bold leading-tight">
                Invite <span className="text-primary italic">Friends</span>
              </h4>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Bring your adventure squad together. Collaborate in real-time on every detail.
              </p>
            </div>
            
            <div className="space-y-6 pt-6 border-t border-white/5">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Collaboration Link</label>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary/20 transition-colors">
                  <LinkIcon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs truncate flex-1 font-mono text-muted-foreground">{inviteLink}</span>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors" onClick={handleCopyLink}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="lg" className="gap-3 rounded-2xl h-14 bg-white/5 border-white/5 hover:bg-green-500/5 hover:border-green-500/30 group/btn transition-all duration-500" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 text-green-500 group-hover/btn:scale-125 transition-transform" />
                    <span className="font-bold text-xs tracking-widest uppercase">WhatsApp</span>
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="gap-3 rounded-2xl h-14 bg-white/5 border-white/5 hover:bg-blue-500/5 hover:border-blue-500/30 group/btn transition-all duration-500" asChild>
                  <a href={emailUrl}>
                    <Mail className="h-4 w-4 text-blue-500 group-hover/btn:scale-125 transition-transform" />
                    <span className="font-bold text-xs tracking-widest uppercase">Email</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {activeUsers.length > 1 && (
        <div className="hidden 2xl:flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 animate-in slide-in-from-right-8 duration-700">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] pt-0.5">
                {activeUsers.length} MEMBERS ONLINE
            </span>
        </div>
      )}
    </div>
  );
}
