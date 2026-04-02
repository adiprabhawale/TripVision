'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, Users, Briefcase, Handshake, Heart, BedDouble, Building, Home, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { TripPreferences } from '@/types/trip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const formSchema = z.object({
  source: z.string().min(2, { message: 'Source must be at least 2 characters.' }),
  destination: z.string().min(2, { message: 'Destination must be at least 2 characters.' }),
  startDate: z.date({ required_error: 'A start date is required.' }),
  duration: z.string().min(1, { message: 'Please enter a duration.' }),
  numberOfPeople: z.string().min(1, {message: 'Please enter number of people'}),
  budgetType: z.enum(['per-person', 'group'], { required_error: 'Please select a budget type.'}),
  budget: z.number().min(100, { message: "Budget must be at least ₹100"}),
  travelType: z.string({ required_error: 'Please select a travel type.' }),
  stayType: z.string({ required_error: 'Please select a stay type.' }),
  interests: z.string().min(3, { message: 'Please list some interests.' }),
});

interface TripPreferencesFormProps {
  onSubmit: (data: TripPreferences) => void;
  isLoading: boolean;
}

export function TripPreferencesForm({ onSubmit, isLoading }: TripPreferencesFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: '',
      destination: '',
      duration: '7',
      numberOfPeople: '1',
      budgetType: 'per-person',
      budget: 50000,
      travelType: 'Friends',
      stayType: 'Hotel',
      interests: '',
    },
  });

  const budgetType = form.watch('budgetType');

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="p-6 pt-2 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/70">Origin</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                        <Input placeholder="Delhi, India" className="pl-10 bg-background/50 border-border/40 focus:border-primary/50 rounded-xl h-12 transition-all" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/70">Destination</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                        <Input placeholder="London, UK" className="pl-10 bg-background/50 border-border/40 focus:border-primary/50 rounded-xl h-12 transition-all" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/70 mb-2">Depart</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-medium h-12 bg-background/50 border-border/40 rounded-xl px-3',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-primary/70" />
                            {field.value ? format(field.value, 'MMM dd') : <span>Pick date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/70">Days</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-background/50 border-border/40 focus:border-primary/50 rounded-xl h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                control={form.control}
                name="numberOfPeople"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/70">People</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-background/50 border-border/40 focus:border-primary/50 rounded-xl h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="travelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/70">Vibe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-border/40 rounded-xl h-12">
                          <SelectValue placeholder="Friends" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Friends">Friends</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Combined">Combined</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/70">Budget (INR)</FormLabel>
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          className="w-24 h-8 bg-background/30 border-border/20 text-xs font-bold text-right pr-2 rounded-lg focus:border-primary/40 focus:ring-0 transition-all"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Controller
                  control={form.control}
                  name="budget"
                  render={({ field: { value, onChange } }) => (
                    <div className="px-1">
                      <Slider
                          min={1000}
                          max={500000}
                          step={1000}
                          value={[value]}
                          onValueChange={(vals) => onChange(vals[0])}
                          className="py-2"
                      />
                      <div className="flex justify-between mt-2 text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">
                        <span>Min ₹1k</span>
                        <span>Max ₹500k</span>
                      </div>
                    </div>
                  )}
              />
            </div>

             <FormField
                control={form.control}
                name="stayType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/70">Stay</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-border/40 rounded-xl h-12">
                          <SelectValue placeholder="Hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Hotel">Hotel</SelectItem>
                        <SelectItem value="Hostel">Hostel</SelectItem>
                        <SelectItem value="Airbnb">Airbnb</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/70">Interests</FormLabel>
                  <FormControl>
                    <Input placeholder="Culture, Food, Museums..." className="bg-background/50 border-border/40 focus:border-primary/50 rounded-xl h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 group transition-all duration-300 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                    Generate Itinerary
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
