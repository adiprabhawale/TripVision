import { useState, useEffect } from 'react';

/**
 * AI-friendly heuristic mapping for international destinations.
 * Includes major cities and countries globally.
 */
const DEST_TO_CURRENCY: Record<string, string> = {
  // --- North America ---
  'usa': 'USD', 'united states': 'USD', 'new york': 'USD', 'nyc': 'USD', 'los angeles': 'USD', 'chicago': 'USD', 'sf': 'USD', 'san francisco': 'USD', 'boston': 'USD', 'miami': 'USD', 'vegas': 'USD', 'las vegas': 'USD', 'washington': 'USD',
  'canada': 'CAD', 'toronto': 'CAD', 'vancouver': 'CAD', 'montreal': 'CAD', 'ottawa': 'CAD',
  
  // --- Europe (EUR) ---
  'europe': 'EUR', 'france': 'EUR', 'paris': 'EUR', 'lyon': 'EUR', 'marseille': 'EUR',
  'germany': 'EUR', 'berlin': 'EUR', 'munich': 'EUR', 'frankfurt': 'EUR', 'hamburg': 'EUR',
  'italy': 'EUR', 'rome': 'EUR', 'milan': 'EUR', 'venice': 'EUR', 'florence': 'EUR', 'naples': 'EUR',
  'spain': 'EUR', 'madrid': 'EUR', 'barcelona': 'EUR', 'seville': 'EUR', 'valencia': 'EUR',
  'netherlands': 'EUR', 'amsterdam': 'EUR', 'rotterdam': 'EUR',
  'belgium': 'EUR', 'brussels': 'EUR',
  'austria': 'EUR', 'vienna': 'EUR',
  'greece': 'EUR', 'athens': 'EUR', 'santorini': 'EUR', 'mykonos': 'EUR',
  'ireland': 'EUR', 'dublin': 'EUR',
  'portugal': 'EUR', 'lisbon': 'EUR', 'porto': 'EUR',
  'finland': 'EUR', 'helsinki': 'EUR',
  
  // --- UK ---
  'uk': 'GBP', 'united kingdom': 'GBP', 'england': 'GBP', 'london': 'GBP', 'manchester': 'GBP', 'birmingham': 'GBP', 'edinburgh': 'GBP', 'glasgow': 'GBP', 'scotland': 'GBP',
  
  // --- Asia ---
  'japan': 'JPY', 'tokyo': 'JPY', 'osaka': 'JPY', 'kyoto': 'JPY', 'yokohama': 'JPY', 'nagoya': 'JPY', 'hokkaido': 'JPY',
  'china': 'CNY', 'beijing': 'CNY', 'shanghai': 'CNY', 'shenzhen': 'CNY', 'hong kong': 'HKD',
  'singapore': 'SGD',
  'thailand': 'THB', 'bangkok': 'THB', 'phuket': 'THB', 'chiang mai': 'THB', 'pattaya': 'THB',
  'indonesia': 'IDR', 'bali': 'IDR', 'jakarta': 'IDR', 'ubud': 'IDR',
  'malaysia': 'MYR', 'kuala lumpur': 'MYR', 'kl': 'MYR', 'penang': 'MYR',
  'vietnam': 'VND', 'hanoi': 'VND', 'saigon': 'VND', 'da nang': 'VND',
  'south korea': 'KRW', 'seoul': 'KRW', 'busan': 'KRW',
  'philippines': 'PHP', 'manila': 'PHP', 'boracay': 'PHP',
  'taiwan': 'TWD', 'taipei': 'TWD',
  'sri lanka': 'LKR', 'colombo': 'LKR', 'kandy': 'LKR',
  'maldives': 'MVR', 'male': 'MVR',
  
  // --- Middle East ---
  'uae': 'AED', 'dubai': 'AED', 'abu dhabi': 'AED', 'sharjah': 'AED',
  'qatar': 'QAR', 'doha': 'QAR',
  'saudi arabia': 'SAR', 'riyadh': 'SAR', 'jeddah': 'SAR', 'mecca': 'SAR',
  'turkey': 'TRY', 'istanbul': 'TRY', 'ankara': 'TRY', 'antalya': 'TRY', 'cappadocia': 'TRY',
  
  // --- Oceania ---
  'australia': 'AUD', 'sydney': 'AUD', 'melbourne': 'AUD', 'brisbane': 'AUD', 'perth': 'AUD',
  'new zealand': 'NZD', 'auckland': 'NZD', 'queenstown': 'NZD',
  
  // --- South America / Others ---
  'brazil': 'BRL', 'rio': 'BRL', 'sao paulo': 'BRL',
  'switzerland': 'CHF', 'zurich': 'CHF', 'geneva': 'CHF', 'lucerne': 'CHF',
  'south africa': 'ZAR', 'cape town': 'ZAR', 'joburg': 'ZAR',
};

/**
 * Heuristic to check if a destination is in India.
 */
const IS_INDIA_EXPRESSION = /(india|in|mumbai|delhi|bangalore|bengaluru|pune|hyderabad|chennai|kolkata|goa|manali|leh|ladakh|jaipur|udaipur|kochi|alappuzha|kerala|srinagar|shimla|rishikesh|kanpur|lucknow|ahmedabad|amritsar)/i;

/**
 * Detects the functional currency code for a given destination string.
 * Defaults to INR if the destination is likely in India or unrecognized.
 */
export function getCurrencyForDestination(destination: string): string {
  if (!destination) return 'INR';
  
  const normalized = destination.toLowerCase().trim();
  
  // 1. Explicit exclusion for India
  if (IS_INDIA_EXPRESSION.test(normalized)) {
    return 'INR';
  }
  
  // 2. Check each word/segment in the destination for a match
  const parts = normalized.split(/[\s,.-]+/);
  
  // Check full string match first
  if (DEST_TO_CURRENCY[normalized]) return DEST_TO_CURRENCY[normalized];
  
  // Check individual parts (e.g., "London, UK" -> "London" or "UK")
  for (const part of parts) {
    if (DEST_TO_CURRENCY[part]) {
      return DEST_TO_CURRENCY[part];
    }
  }
  
  // 3. Fallback to INR (Most users are from India)
  return 'INR';
}

/**
 * Currency Symbol Map
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  'INR': '₹',
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'SGD': 'S$',
  'AED': 'AED',
  'AUD': 'A$',
  'CAD': 'C$',
  'CHF': 'CHF',
  'IDR': 'Rp',
  'THB': '฿',
  'MYR': 'RM',
  'CNY': '¥',
  'HKD': 'HK$',
  'NZD': 'NZ$',
};

/**
 * Live Currency Conversion Hook
 * Powered by Frankfurter API (Free, no-key needed)
 */
export function useCurrencyConverter(destination: string, amountINR: number = 0) {
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = getCurrencyForDestination(destination);
    setTargetCurrency(code);
    
    if (code === 'INR') {
      setRate(1);
      return;
    }

    async function fetchRate() {
      setLoading(true);
      try {
        const response = await fetch(`https://api.frankfurter.dev/latest?from=INR&to=${code}`);
        if (!response.ok) throw new Error('Conversion unavailable');
        const data = await response.json();
        setRate(data.rates[code]);
      } catch (err: any) {
        console.warn('Currency Fetch Failed:', err);
        setError(err.message);
        setRate(1); // Default fallback to 1:1 if API is down
      } finally {
        setLoading(false);
      }
    }

    fetchRate();
  }, [destination]);

  const convertedValue = (amountINR * rate).toFixed(2);
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;

  return {
    isInternational: targetCurrency !== 'INR',
    targetCurrency,
    rate,
    symbol,
    convertedAmount: parseFloat(convertedValue),
    loading,
    error,
    formatConversion: (valINR: number) => {
        if (targetCurrency === 'INR') return `₹${valINR.toLocaleString('en-IN')}`;
        const localVal = (valINR * rate).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        return `₹${valINR.toLocaleString('en-IN')} (≈ ${symbol}${localVal})`;
    },
    formatLocalOnly: (valINR: number) => {
        const localVal = (valINR * rate).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        return `${symbol}${localVal}`;
    }
  };
}
