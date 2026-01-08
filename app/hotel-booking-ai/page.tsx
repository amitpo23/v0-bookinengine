'use client';

/**
 * Hotel Booking AI - Main Page
 * Dashboard and chat interface for Hotel Booking AI engines
 */

import React, { useState } from 'react';
import { HotelBookingDashboard, HotelBookingChat } from '@/components/hotel-booking-ai';

export default function HotelBookingAIPage() {
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'he'>('en');

  const handleSelectEngine = (instanceId: string) => {
    setSelectedEngineId(instanceId);
  };

  const handleBack = () => {
    setSelectedEngineId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setLanguage(lang => lang === 'en' ? 'he' : 'en')}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
          {language === 'en' ? 'עברית' : 'English'}
        </button>
      </div>

      {selectedEngineId ? (
        <div className="h-screen">
          <HotelBookingChat
            instanceId={selectedEngineId}
            language={language}
            onBack={handleBack}
            className="h-full"
          />
        </div>
      ) : (
        <HotelBookingDashboard
          language={language}
          onSelectEngine={handleSelectEngine}
        />
      )}
    </div>
  );
}
