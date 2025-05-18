
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDate, convertGregorianToHijri, convertHijriToGregorian, getMonthName, getWeekdayName, getMaxDayForMonth } from '@/utils/dateUtils';
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DateConverterProps {
  language: 'en' | 'ar';
}

const DateConverter: React.FC<DateConverterProps> = ({ language }) => {
  // Default to current date
  const today = new Date();
  const [inputType, setInputType] = useState<'gregorian' | 'hijri'>('gregorian');
  
  const [gregorianDate, setGregorianDate] = useState<CalendarDate>({
    day: today.getDate(),
    month: today.getMonth() + 1, // JavaScript months are 0-indexed
    year: today.getFullYear(),
    type: 'gregorian'
  });
  
  const [hijriDate, setHijriDate] = useState<CalendarDate>(() => {
    // Initialize with conversion from today's Gregorian date
    return convertGregorianToHijri({
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      type: 'gregorian'
    });
  });
  
  const [maxDaysInput, setMaxDaysInput] = useState(31);
  const [maxDaysOutput, setMaxDaysOutput] = useState(30);
  
  // Array of years for selection
  const gregorianYears = Array.from({ length: 201 }, (_, i) => 1900 + i);
  const hijriYears = Array.from({ length: 201 }, (_, i) => 1400 + i);
  
  // Array of months for selection (1-12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Update max days when month/year changes
  useEffect(() => {
    const inputDate = inputType === 'gregorian' ? gregorianDate : hijriDate;
    const outputDate = inputType === 'gregorian' ? hijriDate : gregorianDate;
    
    const maxDaysForInputMonth = getMaxDayForMonth(
      inputDate.month, 
      inputDate.year,
      inputDate.type
    );
    
    const maxDaysForOutputMonth = getMaxDayForMonth(
      outputDate.month, 
      outputDate.year, 
      outputDate.type
    );
    
    setMaxDaysInput(maxDaysForInputMonth);
    setMaxDaysOutput(maxDaysForOutputMonth);
    
    // Adjust the day if it exceeds the maximum for the month
    if (inputDate.day > maxDaysForInputMonth) {
      if (inputType === 'gregorian') {
        handleDateChange('day', maxDaysForInputMonth, 'gregorian');
      } else {
        handleDateChange('day', maxDaysForInputMonth, 'hijri');
      }
    }
  }, [
    inputType, 
    gregorianDate.month, gregorianDate.year, 
    hijriDate.month, hijriDate.year
  ]);
  
  // Handle date changes for either calendar
  const handleDateChange = (field: 'day' | 'month' | 'year', value: number, calendar: 'gregorian' | 'hijri') => {
    if (calendar === 'gregorian') {
      const newGregorianDate = {
        ...gregorianDate,
        [field]: value
      };
      setGregorianDate(newGregorianDate);
      
      // Only calculate conversion if this is the input type
      if (inputType === 'gregorian') {
        setHijriDate(convertGregorianToHijri(newGregorianDate));
      }
    } else {
      const newHijriDate = {
        ...hijriDate,
        [field]: value
      };
      setHijriDate(newHijriDate);
      
      // Only calculate conversion if this is the input type
      if (inputType === 'hijri') {
        setGregorianDate(convertHijriToGregorian(newHijriDate));
      }
    }
  };
  
  // Function to switch input/output calendars
  const handleSwapCalendars = () => {
    setInputType(inputType === 'gregorian' ? 'hijri' : 'gregorian');
  };
  
  // Generate days for selection based on maximum days
  const inputDays = Array.from({ length: maxDaysInput }, (_, i) => i + 1);
  const outputDays = Array.from({ length: maxDaysOutput }, (_, i) => i + 1);
  
  // Determine which dates to use for input and output
  const inputDate = inputType === 'gregorian' ? gregorianDate : hijriDate;
  const outputDate = inputType === 'gregorian' ? hijriDate : gregorianDate;
  
  // Get weekday names for both dates
  const inputWeekday = getWeekdayName(inputDate, language);
  const outputWeekday = getWeekdayName(outputDate, language);
  
  // Format month display with number
  const formatMonthLabel = (month: number, calendar: 'gregorian' | 'hijri') => {
    return `${month} - ${getMonthName(month, calendar, language)}`;
  };
  
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <h2 className="calendar-heading mx-auto text-center">
        {language === 'en' ? 'Calendar Converter' : 'محول التقويم'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Input Calendar */}
        <Card className="calendar-container">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">
              {inputType === 'gregorian' 
                ? (language === 'en' ? 'Gregorian Date' : 'التاريخ الميلادي')
                : (language === 'en' ? 'Hijri Date' : 'التاريخ الهجري')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="input-label">
                  {language === 'en' ? 'Day' : 'اليوم'}
                </label>
                <Select 
                  value={inputDate.day.toString()} 
                  onValueChange={(value) => handleDateChange('day', parseInt(value), inputType)}
                >
                  <SelectTrigger className="date-select">
                    <SelectValue placeholder={language === 'en' ? 'Day' : 'اليوم'} />
                  </SelectTrigger>
                  <SelectContent>
                    {inputDays.map(day => (
                      <SelectItem key={`input-day-${day}`} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-islamic-navy/70 mt-2">
                  {inputWeekday}
                </p>
              </div>
              
              <div>
                <label className="input-label">
                  {language === 'en' ? 'Month' : 'الشهر'}
                </label>
                <Select 
                  value={inputDate.month.toString()} 
                  onValueChange={(value) => handleDateChange('month', parseInt(value), inputType)}
                >
                  <SelectTrigger className="date-select">
                    <SelectValue 
                      placeholder={language === 'en' ? 'Month' : 'الشهر'} 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={`input-month-${month}`} value={month.toString()}>
                        {formatMonthLabel(month, inputType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="input-label">
                  {language === 'en' ? 'Year' : 'السنة'}
                </label>
                <Select 
                  value={inputDate.year.toString()} 
                  onValueChange={(value) => handleDateChange('year', parseInt(value), inputType)}
                >
                  <SelectTrigger className="date-select">
                    <SelectValue placeholder={language === 'en' ? 'Year' : 'السنة'} />
                  </SelectTrigger>
                  <SelectContent>
                    {(inputType === 'gregorian' ? gregorianYears : hijriYears).map(year => (
                      <SelectItem key={`input-year-${year}`} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Swap Button */}
        <div className="flex justify-center items-center">
          <Button 
            onClick={handleSwapCalendars}
            variant="outline" 
            className="rounded-full w-12 h-12 flex items-center justify-center border-islamic-teal text-islamic-teal hover:bg-islamic-teal hover:text-white rotate-90 md:rotate-0"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Output Calendar */}
        <Card className="calendar-container">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">
              {inputType === 'hijri' 
                ? (language === 'en' ? 'Gregorian Date' : 'التاريخ الميلادي')
                : (language === 'en' ? 'Hijri Date' : 'التاريخ الهجري')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="input-label">{language === 'en' ? 'Day' : 'اليوم'}</p>
                <p className="date-select">{outputDate.day}</p>
                <p className="text-sm text-islamic-navy/70 mt-2">
                  {outputWeekday}
                </p>
              </div>
              
              <div>
                <p className="input-label">{language === 'en' ? 'Month' : 'الشهر'}</p>
                <p className="date-select">
                  {outputDate.month} - {getMonthName(outputDate.month, outputDate.type, language)}
                </p>
              </div>
              
              <div>
                <p className="input-label">{language === 'en' ? 'Year' : 'السنة'}</p>
                <p className="date-select">{outputDate.year}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4 p-4 bg-islamic-light/50 rounded-lg border border-islamic-navy/10 text-sm text-center">
        {language === 'en' 
          ? "Note: This is a simplified conversion. In a production application, we would use a certified Hijri calendar API for more accurate calculations."
          : "ملاحظة: هذا تحويل مبسط. في التطبيق النهائي، سنستخدم واجهة برمجة تطبيقات معتمدة للتقويم الهجري للحصول على حسابات أكثر دقة."}
      </div>
      
      <div className="pattern-divider my-8"></div>
    </div>
  );
};

export default DateConverter;
