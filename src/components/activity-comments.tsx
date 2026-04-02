'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { addComment, deleteComment } from '@/app/comment-actions';
import { Trash2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityCommentsProps {
  tripId: string;
  activityId: string;
}

export function ActivityComments({ tripId, activityId }: ActivityCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!tripId || !activityId) return;

    const q = query(
      collection(db, 'trips', tripId, 'comments'),
      where('activityId', '==', activityId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      
      // Sort in memory to avoid needing a Firestore composite index
      const sortedDocs = [...docs].sort((a, b) => {
        const timeA = a.createdAt?.toDate?.()?.getTime() || 0;
        const timeB = b.createdAt?.toDate?.()?.getTime() || 0;
        return timeA - timeB;
      });
      
      setComments(sortedDocs);
    });

    return () => unsubscribe();
  }, [tripId, activityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await addComment(
      tripId, 
      activityId, 
      user.uid, 
      user.displayName || 'User', 
      user.photoURL || '', 
      newComment
    );
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment(tripId, commentId);
  };

  return (
    <div className="mt-4 space-y-4 border-t pt-4">
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.userPhoto} alt={comment.userName} />
              <AvatarFallback>{comment.userName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-muted rounded-lg p-2 relative">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold">{comment.userName}</span>
                <span className="text-[10px] text-muted-foreground">
                  {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate()) + ' ago' : 'Just now'}
                </span>
              </div>
              <p className="text-sm mt-0.5">{comment.text}</p>
              
              {comment.userId === user?.uid && (
                <button 
                  onClick={() => handleDelete(comment.id)}
                  className="absolute -right-2 -top-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input 
          placeholder="Add a comment..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="h-8 text-sm"
          disabled={!user}
        />
        <Button size="icon" className="h-8 w-8" disabled={!user || isSubmitting}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
