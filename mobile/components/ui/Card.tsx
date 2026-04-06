import React from 'react';
import { View, ViewProps } from 'react-native';

export function Card({ className, ...props }: ViewProps) {
  return (
    <View className={`rounded-xl border border-border bg-card text-card-foreground shadow-sm ${className || ''}`} {...props} />
  );
}

export function CardHeader({ className, ...props }: ViewProps) {
  return <View className={`flex-col space-y-1.5 p-6 ${className || ''}`} {...props} />;
}

export function CardContent({ className, ...props }: ViewProps) {
  return <View className={`p-6 pt-0 ${className || ''}`} {...props} />;
}

export function CardFooter({ className, ...props }: ViewProps) {
  return <View className={`flex-row items-center p-6 pt-0 ${className || ''}`} {...props} />;
}
