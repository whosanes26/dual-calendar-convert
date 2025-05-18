import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

type CalendarType = "gregorian" | "hijri";
type LanguageType = "en" | "ar";

export interface CalendarDate {
  day: number;
  month: number;
  year: number;
  type: CalendarType;
}

// Mapping for month names in both calendars and languages
export const monthNames = {
  gregorian: {
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    ar: [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ]
  },
  hijri: {
    en: [
      "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Awwal", "Jumada al-Thani",
      "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ],
    ar: [
      "محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الآخرة",
      "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
    ]
  }
};

// Mapping for weekday names
export const weekdayNames = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  ar: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
};

// Data for Islamic events
export const islamicEvents = [
  { name: { en: "Islamic New Year", ar: "رأس السنة الهجرية" }, month: 1, day: 1 },
  { name: { en: "Day of Ashura", ar: "يوم عاشوراء" }, month: 1, day: 10 },
  { name: { en: "Mawlid al-Nabi", ar: "المولد النبوي" }, month: 3, day: 12 },
  { name: { en: "Laylat al-Mi'raj", ar: "ليلة المعراج" }, month: 7, day: 27 },
  { name: { en: "15th of Sha'ban", ar: "النصف من شعبان" }, month: 8, day: 15 },
  { name: { en: "1st of Ramadan", ar: "أول رمضان" }, month: 9, day: 1 },
  { name: { en: "Laylat al-Qadr", ar: "ليلة القدر" }, month: 9, day: 27 },
  { name: { en: "Eid al-Fitr", ar: "عيد الفطر" }, month: 10, day: 1 },
  { name: { en: "Day of Arafah", ar: "يوم عرفة" }, month: 12, day: 9 },
  { name: { en: "Eid al-Adha", ar: "عيد الأضحى" }, month: 12, day: 10 }
];

// Function to get the number of days in a Gregorian month
export function getDaysInGregorianMonth(month: number, year: number): number {
  // JavaScript months are 0-indexed
  return new Date(year, month, 0).getDate();
}

// This is a simplified conversion function that will be replaced with actual API call
// In a production app, we would integrate with an accurate Hijri calendar API
export function convertGregorianToHijri(date: CalendarDate): CalendarDate {
  // This is a very approximate conversion - in a real app we would use an API
  // The actual conversion requires complex calculations accounting for lunar cycles
  const gregorianDate = new Date(date.year, date.month - 1, date.day);
  
  // Approximate calculation - this should be replaced with API call
  // Average Hijri year is about 354.367 days (shorter than Gregorian)
  const gregorianTimestamp = gregorianDate.getTime();
  const hijriEpoch = new Date(622, 6, 16).getTime(); // Approximate Hijri epoch in Gregorian
  const daysSinceHijriEpoch = (gregorianTimestamp - hijriEpoch) / (1000 * 60 * 60 * 24);
  
  // Convert to Hijri - very approximate
  const hijriYear = Math.floor(daysSinceHijriEpoch / 354.367) + 1;
  const daysInCurrentHijriYear = daysSinceHijriEpoch % 354.367;
  
  // Calculate month and day - very approximate
  let dayCount = 0;
  let hijriMonth = 1;
  let hijriDay = 0;
  
  // Simplified month lengths alternating between 30 and 29 days
  for (let i = 1; i <= 12; i++) {
    const daysInMonth = i % 2 === 1 ? 30 : 29;
    if (dayCount + daysInMonth > daysInCurrentHijriYear) {
      hijriMonth = i;
      hijriDay = Math.floor(daysInCurrentHijriYear - dayCount) + 1;
      break;
    }
    dayCount += daysInMonth;
  }
  
  // Ensure valid day
  hijriDay = Math.max(1, Math.min(hijriDay, hijriMonth % 2 === 1 ? 30 : 29));
  
  return {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear,
    type: 'hijri'
  };
}

// This is a simplified conversion function that will be replaced with actual API call
export function convertHijriToGregorian(date: CalendarDate): CalendarDate {
  // This is a very approximate conversion - in a real app we would use an API
  // The actual conversion requires complex calculations accounting for lunar cycles
  
  // Calculate approximate days since Hijri epoch
  const hijriDays = (date.year - 1) * 354.367; // Average Hijri year
  
  // Add days for completed months
  let daysInPriorMonths = 0;
  for (let i = 1; i < date.month; i++) {
    daysInPriorMonths += i % 2 === 1 ? 30 : 29;
  }
  
  // Total days since Hijri epoch
  const totalDays = hijriDays + daysInPriorMonths + date.day;
  
  // Approximate Gregorian date
  const hijriEpoch = new Date(622, 6, 16); // Approximate Hijri epoch in Gregorian
  const gregDate = new Date(hijriEpoch);
  gregDate.setDate(hijriEpoch.getDate() + Math.floor(totalDays));
  
  return {
    day: gregDate.getDate(),
    month: gregDate.getMonth() + 1, // JavaScript months are 0-indexed
    year: gregDate.getFullYear(),
    type: 'gregorian'
  };
}

// Format the current date and time according to the language
export function formatCurrentDateTime(language: LanguageType = 'en'): string {
  const now = new Date();
  const options = { 
    hour: "2-digit" as const, 
    minute: "2-digit" as const, 
    hour12: true 
  };
  
  // Get formatted time
  const timeFormatter = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-SA', options);
  const timeStr = timeFormatter.format(now);
  
  // Get formatted date using date-fns
  const dateStr = format(
    now,
    language === 'en' ? 'dd MMMM, yyyy' : 'dd MMMM، yyyy',
    { locale: language === 'en' ? enUS : ar }
  );
  
  // For Hijri date, in a real application we would use an API call
  // Here we're using our simplified conversion
  const hijriDate = convertGregorianToHijri({
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    type: 'gregorian'
  });
  
  const hijriMonth = monthNames.hijri[language][hijriDate.month - 1];
  const hijriStr = `${hijriDate.day} ${hijriMonth}, ${hijriDate.year}`;
  
  return language === 'en'
    ? `Hijri: ${hijriStr} | Gregorian: ${dateStr} | ${timeStr}`
    : `الهجري: ${hijriStr} | الميلادي: ${dateStr} | ${timeStr}`;
}

// Get the name of a month in the given calendar system and language
export function getMonthName(month: number, calendar: CalendarType, language: LanguageType): string {
  if (month < 1 || month > 12) return '';
  return monthNames[calendar][language][month - 1];
}

// Get the weekday name for a given date
export function getWeekdayName(date: CalendarDate, language: LanguageType): string {
  // Convert to JavaScript Date object if it's a Gregorian date
  if (date.type === 'gregorian') {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    const dayIndex = jsDate.getDay();
    return weekdayNames[language][dayIndex];
  }
  
  // For Hijri dates, convert to Gregorian first
  const gregorianDate = convertHijriToGregorian(date);
  const jsDate = new Date(gregorianDate.year, gregorianDate.month - 1, gregorianDate.day);
  const dayIndex = jsDate.getDay();
  return weekdayNames[language][dayIndex];
}

// Generate upcoming Islamic events based on current Hijri date
export function getUpcomingIslamicEvents(currentHijriDate: CalendarDate, count: number = 5): any[] {
  const events = [];
  let eventCount = 0;
  let currentYear = currentHijriDate.year;
  
  // First try to find events in the current year
  for (const event of islamicEvents) {
    if (
      (event.month > currentHijriDate.month) || 
      (event.month === currentHijriDate.month && event.day >= currentHijriDate.day)
    ) {
      const hijriDate: CalendarDate = {
        day: event.day,
        month: event.month,
        year: currentYear,
        type: 'hijri'
      };
      
      const gregorianDate = convertHijriToGregorian(hijriDate);
      
      events.push({
        ...event,
        hijriDate,
        gregorianDate
      });
      
      eventCount++;
      
      if (eventCount >= count) break;
    }
  }
  
  // If we need more events, look into next year
  if (eventCount < count) {
    for (const event of islamicEvents) {
      const hijriDate: CalendarDate = {
        day: event.day,
        month: event.month,
        year: currentYear + 1,
        type: 'hijri'
      };
      
      const gregorianDate = convertHijriToGregorian(hijriDate);
      
      events.push({
        ...event,
        hijriDate,
        gregorianDate
      });
      
      eventCount++;
      
      if (eventCount >= count) break;
    }
  }
  
  return events;
}

// Function to get the maximum day for a given month in either calendar
export function getMaxDayForMonth(month: number, year: number, calendar: CalendarType): number {
  if (calendar === 'gregorian') {
    return getDaysInGregorianMonth(month, year);
  } else { // Hijri
    // Simplified Hijri calendar logic - alternating 30 and 29 days
    // In a real app, this would use more accurate calculations
    return month % 2 === 1 ? 30 : 29;
  }
}
