
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { formatCurrentDateTime } from '@/utils/dateUtils';

interface HeaderProps {
  language: 'en' | 'ar';
  setLanguage: React.Dispatch<React.SetStateAction<'en' | 'ar'>>;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const [currentDateTime, setCurrentDateTime] = useState(formatCurrentDateTime(language));
  
  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      setCurrentDateTime(formatCurrentDateTime(language));
    }, 1000);
    
    // Set the HTML lang attribute
    document.documentElement.lang = language;
    
    return () => clearInterval(interval);
  }, [language]);
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };
  
  return (
    <header className="bg-islamic-navy text-white py-4 px-6 flex flex-col sm:flex-row justify-between items-center">
      <div className="mb-3 sm:mb-0 text-center sm:text-left">
        <h1 className="text-2xl font-bold">
          {language === 'en' ? 'Hijri Calendar Converter' : 'محول التقويم الهجري'}
        </h1>
        <p className="text-islamic-gold">
          {language === 'en' ? 'Accurate Date Conversion & Islamic Events' : 'تحويل دقيق للتاريخ والمناسبات الإسلامية'}
        </p>
      </div>
      
      <div className="flex flex-col items-end">
        <Button 
          variant="outline"
          className="mb-2 text-white hover:text-islamic-navy border-islamic-gold hover:bg-islamic-gold bg-transparent"
          onClick={toggleLanguage}
        >
          {language === 'en' ? 'العربية' : 'English'}
        </Button>
        <p className="text-sm font-light">{currentDateTime}</p>
      </div>
    </header>
  );
};

export default Header;
