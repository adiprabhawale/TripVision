import React, { createContext, useContext, useState } from 'react';

export type TripVibe = 'default' | 'tropical' | 'city' | 'desert';

interface ThemeContextType {
  vibe: TripVibe;
  setVibe: (vibe: TripVibe) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  vibe: 'default',
  setVibe: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [vibe, setVibe] = useState<TripVibe>('default');

  return (
    <ThemeContext.Provider value={{ vibe, setVibe }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeVibe() {
  return useContext(ThemeContext);
}
