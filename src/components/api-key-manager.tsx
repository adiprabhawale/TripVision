'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KeyRound } from 'lucide-react';

interface ApiKeyManagerProps {
  onSubmit: (apiKey: string) => void;
}

export function ApiKeyManager({ onSubmit }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      onSubmit(apiKey);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Gemini API Key Required</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Please enter your Gemini API key to use TripVision. You can get a key from Google AI Studio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full" disabled={!apiKey}>
              Save and Continue
            </Button>
            <p className="text-xs text-center text-muted-foreground pt-2">
                Your API key is stored securely in your browser's local storage and is never sent to our servers.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
