import { getTripById } from '@/app/trip-actions';
import { notFound } from 'next/navigation';
import { TripPageClient } from '@/components/trip-page-client';

export const dynamic = 'force-dynamic';

export default async function TripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const result = await getTripById(tripId);

  if (result.error || !result.data) {
    notFound();
  }

  return <TripPageClient tripId={tripId} tripData={result.data} />;
}
