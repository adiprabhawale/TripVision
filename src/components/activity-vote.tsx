'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import { Button } from './ui/button';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { voteOnActivity } from '@/app/vote-actions';

import { ActivityComments } from './activity-comments';

interface ActivityVoteProps {
  tripId: string;
  activityId: string;
}

export function ActivityVote({ tripId, activityId }: ActivityVoteProps) {
  const { user } = useAuth();
  const [votes, setVotes] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!tripId || !activityId) return;

    // Listen for votes
    const votesQuery = query(
      collection(db, 'trips', tripId, 'votes'),
      where('activityId', '==', activityId)
    );
    const unsubscribeVotes = onSnapshot(votesQuery, (snapshot) => {
      setVotes(snapshot.size);
      const userVote = snapshot.docs.find(doc => doc.data().userId === user?.uid);
      setHasVoted(!!userVote);
    });

    // Listen for comments count
    const commentsQuery = query(
      collection(db, 'trips', tripId, 'comments'),
      where('activityId', '==', activityId)
    );
    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      setCommentsCount(snapshot.size);
    });

    return () => {
      unsubscribeVotes();
      unsubscribeComments();
    };
  }, [tripId, activityId, user]);

  const handleVote = async () => {
    if (!user || !tripId || isLoading) return;
    
    setIsLoading(true);
    const voteType = hasVoted ? 'down' : 'up';
    await voteOnActivity(tripId, activityId, user.uid, voteType);
    setIsLoading(false);
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-3">
        <Button 
          variant={hasVoted ? "default" : "outline"} 
          size="sm" 
          className="h-8 gap-1.5"
          onClick={handleVote}
          disabled={isLoading}
        >
          <ThumbsUp className={`h-3.5 w-3.5 ${hasVoted ? 'fill-current' : ''}`} />
          <span>{votes}</span>
        </Button>
        <Button 
          variant={showComments ? "secondary" : "ghost"} 
          size="sm" 
          className="h-8 gap-1.5 text-muted-foreground"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{commentsCount}</span>
        </Button>
      </div>

      {showComments && <ActivityComments tripId={tripId} activityId={activityId} />}
    </div>
  );
}
