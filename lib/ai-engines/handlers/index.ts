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

// Payment handlers
export {
  createPaymentIntent,
  processPayment,
  verifyPayment,
  getPaymentStatus,
  cancelPayment,
  getBookingPayments,
  paymentHandlers
} from './payment';

// Refund handlers
export {
  calculateRefundAmount,
  processRefund,
  processPartialRefund,
  getRefundStatus,
  getBookingRefunds,
  autoRefundWithPolicy,
  refundHandlers
} from './refund';

// Invoice handlers
export {
  generateInvoice,
  sendInvoiceEmail,
  getInvoice,
  generateReceipt,
  invoiceHandlers
} from './invoice';

// Fraud detection handlers
export {
  analyzeBookingRisk,
  flagSuspiciousActivity,
  getRiskScore,
  checkBlacklist,
  runFraudChecks,
  fraudHandlers
} from './fraud';

// Insurance handlers
export {
  getInsurancePlans,
  getInsuranceQuote,
  purchaseInsurance,
  getInsurancePolicy,
  cancelInsurance,
  fileInsuranceClaim,
  getClaimStatus,
  insuranceHandlers
} from './insurance';

// Abandoned cart handlers
export {
  trackCartActivity,
  markCartAbandoned,
  getAbandonedCarts,
  sendRecoveryEmail,
  markCartRecovered,
  getRecoveryLink,
  getRecoveryStats,
  runRecoveryCampaign,
  abandonedCartHandlers
} from './abandoned-cart';

// WhatsApp handlers
export {
  sendWhatsAppMessage,
  sendBookingConfirmation,
  sendCheckInReminder,
  sendBookingOptions,
  handleIncomingMessage,
  getConversation,
  sendBulkNotification,
  getWhatsAppStats,
  whatsappHandlers
} from './whatsapp';

// Reviews handlers
export {
  requestReview,
  submitReview,
  getHotelReviews,
  moderateReview,
  respondToReview,
  markReviewHelpful,
  generateReviewSummary,
  sendReviewRequests,
  reviewHandlers
} from './reviews';

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
  },

  // Payment handlers
  'lib/ai-engines/handlers/payment.createPaymentIntent': async (params: any, context: any) => {
    const { createPaymentIntent } = await import('./payment');
    return createPaymentIntent(params, context);
  },
  'lib/ai-engines/handlers/payment.processPayment': async (params: any, context: any) => {
    const { processPayment } = await import('./payment');
    return processPayment(params, context);
  },
  'lib/ai-engines/handlers/payment.verifyPayment': async (params: any, context: any) => {
    const { verifyPayment } = await import('./payment');
    return verifyPayment(params, context);
  },
  'lib/ai-engines/handlers/payment.getPaymentStatus': async (params: any, context: any) => {
    const { getPaymentStatus } = await import('./payment');
    return getPaymentStatus(params, context);
  },
  'lib/ai-engines/handlers/payment.cancelPayment': async (params: any, context: any) => {
    const { cancelPayment } = await import('./payment');
    return cancelPayment(params, context);
  },

  // Refund handlers
  'lib/ai-engines/handlers/refund.calculateRefundAmount': async (params: any, context: any) => {
    const { calculateRefundAmount } = await import('./refund');
    return calculateRefundAmount(params, context);
  },
  'lib/ai-engines/handlers/refund.processRefund': async (params: any, context: any) => {
    const { processRefund } = await import('./refund');
    return processRefund(params, context);
  },
  'lib/ai-engines/handlers/refund.processPartialRefund': async (params: any, context: any) => {
    const { processPartialRefund } = await import('./refund');
    return processPartialRefund(params, context);
  },
  'lib/ai-engines/handlers/refund.getRefundStatus': async (params: any, context: any) => {
    const { getRefundStatus } = await import('./refund');
    return getRefundStatus(params, context);
  },
  'lib/ai-engines/handlers/refund.autoRefundWithPolicy': async (params: any, context: any) => {
    const { autoRefundWithPolicy } = await import('./refund');
    return autoRefundWithPolicy(params, context);
  },

  // Invoice handlers
  'lib/ai-engines/handlers/invoice.generateInvoice': async (params: any, context: any) => {
    const { generateInvoice } = await import('./invoice');
    return generateInvoice(params, context);
  },
  'lib/ai-engines/handlers/invoice.sendInvoiceEmail': async (params: any, context: any) => {
    const { sendInvoiceEmail } = await import('./invoice');
    return sendInvoiceEmail(params, context);
  },
  'lib/ai-engines/handlers/invoice.generateReceipt': async (params: any, context: any) => {
    const { generateReceipt } = await import('./invoice');
    return generateReceipt(params, context);
  },

  // Fraud detection handlers
  'lib/ai-engines/handlers/fraud.analyzeBookingRisk': async (params: any, context: any) => {
    const { analyzeBookingRisk } = await import('./fraud');
    return analyzeBookingRisk(params, context);
  },
  'lib/ai-engines/handlers/fraud.flagSuspiciousActivity': async (params: any, context: any) => {
    const { flagSuspiciousActivity } = await import('./fraud');
    return flagSuspiciousActivity(params, context);
  },
  'lib/ai-engines/handlers/fraud.getRiskScore': async (params: any, context: any) => {
    const { getRiskScore } = await import('./fraud');
    return getRiskScore(params, context);
  },
  'lib/ai-engines/handlers/fraud.checkBlacklist': async (params: any, context: any) => {
    const { checkBlacklist } = await import('./fraud');
    return checkBlacklist(params, context);
  },
  'lib/ai-engines/handlers/fraud.runFraudChecks': async (params: any, context: any) => {
    const { runFraudChecks } = await import('./fraud');
    return runFraudChecks(params, context);
  },

  // Insurance handlers
  'lib/ai-engines/handlers/insurance.getInsurancePlans': async (params: any, context: any) => {
    const { getInsurancePlans } = await import('./insurance');
    return getInsurancePlans(params, context);
  },
  'lib/ai-engines/handlers/insurance.getInsuranceQuote': async (params: any, context: any) => {
    const { getInsuranceQuote } = await import('./insurance');
    return getInsuranceQuote(params, context);
  },
  'lib/ai-engines/handlers/insurance.purchaseInsurance': async (params: any, context: any) => {
    const { purchaseInsurance } = await import('./insurance');
    return purchaseInsurance(params, context);
  },
  'lib/ai-engines/handlers/insurance.cancelInsurance': async (params: any, context: any) => {
    const { cancelInsurance } = await import('./insurance');
    return cancelInsurance(params, context);
  },
  'lib/ai-engines/handlers/insurance.fileInsuranceClaim': async (params: any, context: any) => {
    const { fileInsuranceClaim } = await import('./insurance');
    return fileInsuranceClaim(params, context);
  },

  // Abandoned cart handlers
  'lib/ai-engines/handlers/abandoned-cart.trackCartActivity': async (params: any, context: any) => {
    const { trackCartActivity } = await import('./abandoned-cart');
    return trackCartActivity(params, context);
  },
  'lib/ai-engines/handlers/abandoned-cart.getAbandonedCarts': async (params: any, context: any) => {
    const { getAbandonedCarts } = await import('./abandoned-cart');
    return getAbandonedCarts(params, context);
  },
  'lib/ai-engines/handlers/abandoned-cart.sendRecoveryEmail': async (params: any, context: any) => {
    const { sendRecoveryEmail } = await import('./abandoned-cart');
    return sendRecoveryEmail(params, context);
  },
  'lib/ai-engines/handlers/abandoned-cart.getRecoveryStats': async (params: any, context: any) => {
    const { getRecoveryStats } = await import('./abandoned-cart');
    return getRecoveryStats(params, context);
  },
  'lib/ai-engines/handlers/abandoned-cart.runRecoveryCampaign': async (params: any, context: any) => {
    const { runRecoveryCampaign } = await import('./abandoned-cart');
    return runRecoveryCampaign(params, context);
  },

  // WhatsApp handlers
  'lib/ai-engines/handlers/whatsapp.sendWhatsAppMessage': async (params: any, context: any) => {
    const { sendWhatsAppMessage } = await import('./whatsapp');
    return sendWhatsAppMessage(params, context);
  },
  'lib/ai-engines/handlers/whatsapp.sendBookingConfirmation': async (params: any, context: any) => {
    const { sendBookingConfirmation } = await import('./whatsapp');
    return sendBookingConfirmation(params, context);
  },
  'lib/ai-engines/handlers/whatsapp.sendCheckInReminder': async (params: any, context: any) => {
    const { sendCheckInReminder } = await import('./whatsapp');
    return sendCheckInReminder(params, context);
  },
  'lib/ai-engines/handlers/whatsapp.handleIncomingMessage': async (params: any, context: any) => {
    const { handleIncomingMessage } = await import('./whatsapp');
    return handleIncomingMessage(params, context);
  },
  'lib/ai-engines/handlers/whatsapp.getWhatsAppStats': async (params: any, context: any) => {
    const { getWhatsAppStats } = await import('./whatsapp');
    return getWhatsAppStats(params, context);
  },

  // Reviews handlers
  'lib/ai-engines/handlers/reviews.requestReview': async (params: any, context: any) => {
    const { requestReview } = await import('./reviews');
    return requestReview(params, context);
  },
  'lib/ai-engines/handlers/reviews.submitReview': async (params: any, context: any) => {
    const { submitReview } = await import('./reviews');
    return submitReview(params, context);
  },
  'lib/ai-engines/handlers/reviews.getHotelReviews': async (params: any, context: any) => {
    const { getHotelReviews } = await import('./reviews');
    return getHotelReviews(params, context);
  },
  'lib/ai-engines/handlers/reviews.respondToReview': async (params: any, context: any) => {
    const { respondToReview } = await import('./reviews');
    return respondToReview(params, context);
  },
  'lib/ai-engines/handlers/reviews.generateReviewSummary': async (params: any, context: any) => {
    const { generateReviewSummary } = await import('./reviews');
    return generateReviewSummary(params, context);
  },
  'lib/ai-engines/handlers/reviews.moderateReview': async (params: any, context: any) => {
    const { moderateReview } = await import('./reviews');
    return moderateReview(params, context);
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
