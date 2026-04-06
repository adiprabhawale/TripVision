import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="mb-2 text-sm font-medium text-foreground">{label}</Text>}
      <TextInput
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring placeholder-muted-foreground ${
          error ? 'border-destructive' : ''
        } ${className || ''}`}
        placeholderTextColor="#a1a1aa" // muted-foreground fallback
        {...props}
      />
      {error && <Text className="mt-1 text-xs text-destructive">{error}</Text>}
    </View>
  );
}
