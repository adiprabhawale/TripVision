import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ItineraryData, TripPreferences } from '@/types/trip';

export const exportToPDF = (itineraryData: ItineraryData, preferences: TripPreferences) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(40);
  doc.text('TripVision: Your Personal Itinerary', 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Destination: ${preferences.destination}`, 14, 32);
  doc.text(`Duration: ${preferences.duration} days`, 14, 38);
  doc.text(`Budget: ${preferences.budget}`, 14, 44);

  let currentY = 55;

  itineraryData.itinerary.forEach((day, index) => {
    // Check for page break
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Day ${day.day_number}: ${day.theme}`, 14, currentY);
    currentY += 8;

    const tableData = day.activities.map(activity => [
      activity.time,
      activity.description,
      activity.estimated_cost
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Time', 'Activity', 'Est. Cost']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        currentY = (data.cursor?.y || 0) + 15;
      }
    });
  });

  // Stay Options
  if (itineraryData.stay_options.length > 0) {
    if (currentY > 220) {
        doc.addPage();
        currentY = 20;
    }
    doc.setFontSize(16);
    doc.text('Suggested Stays', 14, currentY);
    currentY += 8;

    const stayData = itineraryData.stay_options.map(stay => [
        stay.name,
        stay.type,
        stay.price_per_night
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [['Name', 'Type', 'Price per Night']],
        body: stayData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] }, // Emerald-500
    });
  }

  doc.save(`TripVision_${preferences.destination.replace(/\s+/g, '_')}_Itinerary.pdf`);
};
