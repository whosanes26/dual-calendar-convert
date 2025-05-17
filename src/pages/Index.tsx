
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DateConverter from '@/components/DateConverter';
import IslamicEvents from '@/components/IslamicEvents';
import Footer from '@/components/Footer';
import { CalendarDate, convertGregorianToHijri } from '@/utils/dateUtils';

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  
  // Get current Hijri date
  const today = new Date();
  const [currentHijriDate, setCurrentHijriDate] = useState<CalendarDate>(() => {
    return convertGregorianToHijri({
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      type: 'gregorian'
    });
  });

  return (
    <div className={`min-h-screen flex flex-col bg-islamic-cream ${language === 'ar' ? 'font-amiri' : 'font-noto'}`}>
      <Header language={language} setLanguage={setLanguage} />
      
      <main className="flex-grow">
        <DateConverter language={language} />
        <IslamicEvents language={language} currentDate={currentHijriDate} />
      </main>
      
      <Footer language={language} />
    </div>
  );
};

export default Index;
