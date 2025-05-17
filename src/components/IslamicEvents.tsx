
import React from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  getUpcomingIslamicEvents, 
  CalendarDate, 
  getMonthName 
} from '@/utils/dateUtils';

interface IslamicEventsProps {
  language: 'en' | 'ar';
  currentDate: CalendarDate;
}

const IslamicEvents: React.FC<IslamicEventsProps> = ({ language, currentDate }) => {
  // Get upcoming Islamic events
  const events = getUpcomingIslamicEvents(currentDate, 8);
  
  // Format the date display
  const formatDate = (date: CalendarDate) => {
    const monthName = getMonthName(date.month, date.type, language);
    return `${date.day} ${monthName} ${date.year}`;
  };
  
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <h2 className="calendar-heading mx-auto text-center">
        {language === 'en' ? 'Upcoming Islamic Events' : 'المناسبات الإسلامية القادمة'}
      </h2>
      
      <Card className="calendar-container">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {language === 'en' 
              ? 'Important dates in the Islamic calendar' 
              : 'تواريخ مهمة في التقويم الإسلامي'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {language === 'en' ? 'Event' : 'المناسبة'}
                </TableHead>
                <TableHead>
                  {language === 'en' ? 'Hijri Date' : 'التاريخ الهجري'}
                </TableHead>
                <TableHead>
                  {language === 'en' ? 'Gregorian Date' : 'التاريخ الميلادي'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event, index) => (
                <TableRow key={index} className={index === 0 ? "bg-islamic-light/40" : ""}>
                  <TableCell className="font-medium">
                    {event.name[language]}
                    {index === 0 && (
                      <span className="ml-2 text-xs bg-islamic-teal text-white px-2 py-1 rounded-full">
                        {language === 'en' ? 'Next' : 'التالي'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(event.hijriDate)}</TableCell>
                  <TableCell>{formatDate(event.gregorianDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="mt-4 p-4 bg-islamic-light/50 rounded-lg border border-islamic-navy/10 text-sm text-center">
        {language === 'en' 
          ? "Note: Actual dates may vary based on moon sightings and regional differences."
          : "ملاحظة: قد تختلف التواريخ الفعلية بناءً على رؤية الهلال والاختلافات الإقليمية."}
      </div>
    </div>
  );
};

export default IslamicEvents;
