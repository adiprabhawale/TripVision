'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { addPackingItem, togglePackingItem, deletePackingItem } from '@/app/packing-actions';
import { Trash2, Plus, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function PackingList({ tripId }: { tripId: string }) {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!tripId) return;

    const q = query(
      collection(db, 'trips', tripId, 'packingList'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(docs);
    });

    return () => unsubscribe();
  }, [tripId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newItem.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await addPackingItem(tripId, user.uid, newItem);
    setNewItem('');
    setIsSubmitting(false);
  };

  const handleToggle = async (itemId: string, completed: boolean) => {
    await togglePackingItem(tripId, itemId, completed);
  };

  const handleDelete = async (itemId: string) => {
    await deletePackingItem(tripId, itemId);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Collaborative Packing List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            placeholder="Add something to pack..." 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1"
            disabled={!user}
          />
          <Button type="submit" size="icon" disabled={!user || isSubmitting}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between group p-2 rounded-md hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={item.completed} 
                  onCheckedChange={(checked) => handleToggle(item.id, checked === true)}
                  disabled={!user}
                />
                <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {item.text}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(item.id)}
                disabled={!user}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No items yet. Start adding!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
