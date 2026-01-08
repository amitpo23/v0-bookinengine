/**
 * Handler Index
 * Central export for all AI engine handlers
 */

// Booking handlers
export { 
  searchHotels,
  prebookRoom,
  bookRoom,
  cancelBooking,
  getCancellationPolicy,
  bookingHandlers
} from './booking';

// Voice handlers
export {
  initiateCall,
  transferToHuman,
  sendCallSummarySms,
  textToSpeech,
  speechToText,
  detectVoiceActivity,
  createRealtimeAudioStream,
  voiceHandlers
} from './voice';

// Monitoring handlers
export {
  trackHotelPrice,
  getPriceHistory,
  analyzePriceTrends,
  scrapeBookingComPrices,
  monitoringHandlers
} from './monitoring';

// Re-export types
export type { RealtimeStreamConfig, RealtimeCallbacks } from './voice';
export type { ScraperConfig, ScrapedPrice } from './monitoring';

/**
 * Handler Registry
 * Maps handler paths to their implementations
 */
export const handlerRegistry: Record<string, Function> = {
  // Booking
  'lib/ai-engines/handlers/booking.searchHotels': async (params: any, context: any) => {
    const { searchHotels } = await import('./booking');
    return searchHotels(params, context);
  },
  'lib/ai-engines/handlers/booking.prebookRoom': async (params: any, context: any) => {
    const { prebookRoom } = await import('./booking');
    return prebookRoom(params, context);
  },
  'lib/ai-engines/handlers/booking.bookRoom': async (params: any, context: any) => {
    const { bookRoom } = await import('./booking');
    return bookRoom(params, context);
  },
  'lib/ai-engines/handlers/booking.cancelBooking': async (params: any, context: any) => {
    const { cancelBooking } = await import('./booking');
    return cancelBooking(params, context);
  },
  'lib/ai-engines/handlers/booking.getCancellationPolicy': async (params: any, context: any) => {
    const { getCancellationPolicy } = await import('./booking');
    return getCancellationPolicy(params, context);
  },

  // Voice
  'lib/ai-engines/handlers/voice.initiateCall': async (params: any, context: any) => {
    const { initiateCall } = await import('./voice');
    return initiateCall(params, context);
  },
  'lib/ai-engines/handlers/voice.transferToHuman': async (params: any, context: any) => {
    const { transferToHuman } = await import('./voice');
    return transferToHuman(params, context);
  },
  'lib/ai-engines/handlers/voice.sendCallSummarySms': async (params: any, context: any) => {
    const { sendCallSummarySms } = await import('./voice');
    return sendCallSummarySms(params, context);
  },

  // Monitoring
  'lib/ai-engines/handlers/monitoring.trackHotelPrice': async (params: any, context: any) => {
    const { trackHotelPrice } = await import('./monitoring');
    return trackHotelPrice(params, context);
  },
  'lib/ai-engines/handlers/monitoring.getPriceHistory': async (params: any, context: any) => {
    const { getPriceHistory } = await import('./monitoring');
    return getPriceHistory(params, context);
  },
  'lib/ai-engines/handlers/monitoring.analyzePriceTrends': async (params: any, context: any) => {
    const { analyzePriceTrends } = await import('./monitoring');
    return analyzePriceTrends(params, context);
  }
};

/**
 * Get handler by path
 */
export function getHandler(handlerPath: string): Function | undefined {
  return handlerRegistry[handlerPath];
}

/**
 * Execute handler by path
 */
export async function executeHandler(
  handlerPath: string,
  params: any,
  context: any
): Promise<any> {
  const handler = handlerRegistry[handlerPath];
  if (!handler) {
    throw new Error(`Handler not found: ${handlerPath}`);
  }
  return handler(params, context);
}
