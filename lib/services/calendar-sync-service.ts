/**
 * Calendar Sync Service
 * Add bookings to user calendars (Google Calendar, Outlook, Apple)
 * Generate calendar files and deep links
 */

// Types
export type CalendarProvider = 'google' | 'outlook' | 'apple' | 'yahoo' | 'ics';

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  allDay?: boolean;
  reminder?: number; // minutes before
  url?: string;
  organizer?: {
    name: string;
    email: string;
  };
}

export interface BookingCalendarData {
  bookingId: string;
  hotelName: string;
  hotelAddress: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: string[];
  confirmationNumber: string;
  hotelPhone?: string;
  hotelEmail?: string;
  specialRequests?: string;
  paymentStatus?: string;
}

export interface CalendarLink {
  provider: CalendarProvider;
  url: string;
  label: string;
  icon?: string;
}

/**
 * Generate calendar event from booking data
 */
export function createCalendarEvent(booking: BookingCalendarData): CalendarEvent {
  const description = [
    `🏨 Hotel: ${booking.hotelName}`,
    `📍 Address: ${booking.hotelAddress}`,
    `🛏️ Room: ${booking.roomType}`,
    `✅ Confirmation: ${booking.confirmationNumber}`,
    `👥 Guests: ${booking.guests.join(', ')}`,
    '',
    booking.hotelPhone ? `📞 Phone: ${booking.hotelPhone}` : '',
    booking.hotelEmail ? `📧 Email: ${booking.hotelEmail}` : '',
    booking.specialRequests ? `📝 Special Requests: ${booking.specialRequests}` : '',
    '',
    'Powered by Booking Engine',
  ].filter(Boolean).join('\n');

  return {
    title: `🏨 ${booking.hotelName} - Check-in`,
    description,
    location: booking.hotelAddress,
    startDate: booking.checkIn,
    endDate: booking.checkOut,
    allDay: true,
    reminder: 24 * 60, // 24 hours before
  };
}

/**
 * Generate Google Calendar link
 */
export function generateGoogleCalendarLink(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${formatDateForGoogle(event.startDate)}/${formatDateForGoogle(event.endDate)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Outlook Calendar link
 */
export function generateOutlookCalendarLink(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: event.startDate,
    enddt: event.endDate,
    allday: event.allDay ? 'true' : 'false',
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generate Office 365 Calendar link
 */
export function generateOffice365CalendarLink(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: event.startDate,
    enddt: event.endDate,
    allday: event.allDay ? 'true' : 'false',
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generate Yahoo Calendar link
 */
export function generateYahooCalendarLink(event: CalendarEvent): string {
  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    desc: event.description,
    in_loc: event.location,
    st: formatDateForYahoo(event.startDate),
    et: formatDateForYahoo(event.endDate),
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

/**
 * Generate ICS file content
 */
export function generateICSContent(event: CalendarEvent): string {
  const uid = `${Date.now()}-booking@hotel.com`;
  const now = formatDateForICS(new Date().toISOString());
  const start = event.allDay 
    ? formatDateOnlyForICS(event.startDate) 
    : formatDateForICS(event.startDate);
  const end = event.allDay 
    ? formatDateOnlyForICS(event.endDate) 
    : formatDateForICS(event.endDate);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Booking Engine//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    event.allDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART:${start}`,
    event.allDay ? `DTEND;VALUE=DATE:${end}` : `DTEND:${end}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `DESCRIPTION:${escapeICSText(event.description)}`,
    `LOCATION:${escapeICSText(event.location)}`,
    event.reminder ? `BEGIN:VALARM\nACTION:DISPLAY\nDESCRIPTION:Reminder\nTRIGGER:-PT${event.reminder}M\nEND:VALARM` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.join('\r\n');
}

/**
 * Download ICS file
 */
export function downloadICSFile(event: CalendarEvent, filename?: string): void {
  const content = generateICSContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `booking-${Date.now()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate all calendar links for a booking
 */
export function getAllCalendarLinks(booking: BookingCalendarData): CalendarLink[] {
  const event = createCalendarEvent(booking);
  
  return [
    {
      provider: 'google',
      url: generateGoogleCalendarLink(event),
      label: 'Google Calendar',
      icon: '📅',
    },
    {
      provider: 'outlook',
      url: generateOutlookCalendarLink(event),
      label: 'Outlook.com',
      icon: '📧',
    },
    {
      provider: 'apple',
      url: 'data:text/calendar,' + encodeURIComponent(generateICSContent(event)),
      label: 'Apple Calendar',
      icon: '🍎',
    },
    {
      provider: 'yahoo',
      url: generateYahooCalendarLink(event),
      label: 'Yahoo Calendar',
      icon: '📆',
    },
  ];
}

/**
 * Sync booking to connected calendar (requires OAuth)
 */
export async function syncToConnectedCalendar(
  provider: CalendarProvider,
  booking: BookingCalendarData,
  accessToken: string
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    const response = await fetch('/api/calendar/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        booking,
        accessToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const result = await response.json();
    return { success: true, eventId: result.eventId };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Update synced calendar event
 */
export async function updateCalendarEvent(
  provider: CalendarProvider,
  eventId: string,
  booking: BookingCalendarData,
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/calendar/sync', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        eventId,
        booking,
        accessToken,
      }),
    });

    return { success: response.ok };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Delete synced calendar event
 */
export async function deleteCalendarEvent(
  provider: CalendarProvider,
  eventId: string,
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/calendar/sync', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        eventId,
        accessToken,
      }),
    });

    return { success: response.ok };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Helper functions
function formatDateForGoogle(isoString: string): string {
  return isoString.replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function formatDateForYahoo(isoString: string): string {
  return isoString.replace(/[-:]/g, '').split('.')[0];
}

function formatDateForICS(isoString: string): string {
  return isoString.replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function formatDateOnlyForICS(isoString: string): string {
  return isoString.split('T')[0].replace(/-/g, '');
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}
