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
import { CalendarIcon, Loader2, Users, Briefcase, Handshake, Heart } from 'lucide-react';
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
  budget: z.number().min(100, { message: "Budget must be at least $100"}),
  travelType: z.string({ required_error: 'Please select a travel type.' }),
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
      budget: 1500,
      travelType: 'Friends',
      interests: '',
    },
  });

  const budgetType = form.watch('budgetType');

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Plan Your Next Adventure</CardTitle>
        <CardDescription>Fill in your preferences and let AI do the planning.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New York, USA" {...field} />
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
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Paris, France" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                     <FormLabel className="pb-1">Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal whitespace-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
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
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="numberOfPeople"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of People</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2" {...field} />
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
                    <FormLabel>Type of Travel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select travel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Business"><Briefcase className="inline-block mr-2"/>Business</SelectItem>
                        <SelectItem value="Friends"><Users className="inline-block mr-2"/>Friends</SelectItem>
                        <SelectItem value="Family"><Heart className="inline-block mr-2"/>Family</SelectItem>
                        <SelectItem value="Combined"><Handshake className="inline-block mr-2"/>Combined</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budgetType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Budget Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="per-person" id="per-person" />
                        </FormControl>
                        <Label htmlFor="per-person" className="font-normal">Per Person</Label>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="group" id="group" />
                        </FormControl>
                        <Label htmlFor="group" className="font-normal">Total Group</Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
                control={form.control}
                name="budget"
                render={({ field: { value, onChange } }) => (
                <FormItem>
                    <FormLabel>Budget {budgetType === 'per-person' ? '(Per Person)' : '(Total)'}</FormLabel>
                    <div className="flex items-center gap-4">
                        <FormControl>
                            <Slider
                                min={100}
                                max={10000}
                                step={100}
                                value={[value]}
                                onValueChange={(vals) => onChange(vals[0])}
                                className="w-full"
                            />
                        </FormControl>
                        <span className="font-semibold w-24 text-right">${value.toLocaleString()}</span>
                    </div>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests &amp; Activities</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., museums, hiking, local cuisine" {...field} />
                  </FormControl>
                   <FormDescription>
                    Separate interests with commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Itinerary'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
