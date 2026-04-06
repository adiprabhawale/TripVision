import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, StyleSheet, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function Button({ label, variant = 'default', size = 'default', className, style, ...props }: ButtonProps) {
  let btnClasses = "flex-row items-center justify-center rounded-md ";
  let textClasses = "font-medium ";

  // Variants
  switch (variant) {
    case 'default':
      btnClasses += "bg-primary ";
      textClasses += "text-primary-foreground ";
      break;
    case 'outline':
      btnClasses += "border border-input bg-background ";
      textClasses += "text-foreground ";
      break;
    case 'secondary':
      btnClasses += "bg-secondary ";
      textClasses += "text-secondary-foreground ";
      break;
    case 'ghost':
      btnClasses += "bg-transparent hover:bg-accent hover:text-accent-foreground ";
      textClasses += "text-foreground ";
      break;
    case 'destructive':
      btnClasses += "bg-destructive ";
      textClasses += "text-destructive-foreground ";
      break;
  }

  // Sizes
  switch (size) {
    case 'default':
      btnClasses += "h-10 px-4 py-2 ";
      textClasses += "text-sm ";
      break;
    case 'sm':
      btnClasses += "h-9 rounded-md px-3 ";
      textClasses += "text-xs ";
      break;
    case 'lg':
      btnClasses += "h-11 rounded-md px-8 ";
      textClasses += "text-base ";
      break;
    case 'icon':
      btnClasses += "h-10 w-10 ";
      break;
  }

  return (
    <TouchableOpacity
      className={`${btnClasses} ${className || ''}`}
      style={style}
      activeOpacity={0.8}
      {...props}
    >
      {props.children ? props.children : <Text className={textClasses}>{label}</Text>}
    </TouchableOpacity>
  );
}
