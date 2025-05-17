
import React from 'react';

interface FooterProps {
  language: 'en' | 'ar';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-islamic-navy text-white py-6 px-6 mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">
              {language === 'en' ? 'Hijri Calendar Converter' : 'محول التقويم الهجري'}
            </h3>
            <p className="text-sm text-islamic-gold">
              {language === 'en' 
                ? 'A tool for accurate date conversion between calendars'
                : 'أداة للتحويل الدقيق للتواريخ بين التقويمات'}
            </p>
          </div>
          
          <div className="text-sm text-islamic-cream/80">
            <p>
              {language === 'en'
                ? '© 2025 Hijri Calendar Project'
                : '© ٢٠٢٥ مشروع التقويم الهجري'}
            </p>
            <p className="mt-1">
              {language === 'en'
                ? 'Made with care for the Muslim community'
                : 'صنع بعناية للمجتمع الإسلامي'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
