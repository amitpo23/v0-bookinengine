/**
 * Cancellation Policy Utility
 */

export interface CancellationStatus {
  isCancellable: boolean;
  refundPercentage: number;
  message: string;
  penaltyAmount?: number;
}

export function getCurrentCancellationStatus(
  bookingDate?: string,
  cancellationPolicy?: string
): CancellationStatus {
  if (!bookingDate) {
    return {
      isCancellable: false,
      refundPercentage: 0,
      message: 'No booking date provided',
    };
  }

  const booking = new Date(bookingDate);
  const now = new Date();
  const hoursUntilBooking = (booking.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Default policy: Free cancellation 24 hours before
  if (hoursUntilBooking > 24) {
    return {
      isCancellable: true,
      refundPercentage: 100,
      message: 'Free cancellation available',
    };
  } else if (hoursUntilBooking > 0) {
    return {
      isCancellable: true,
      refundPercentage: 50,
      message: 'Partial refund available',
      penaltyAmount: 50,
    };
  } else {
    return {
      isCancellable: false,
      refundPercentage: 0,
      message: 'Non-refundable',
    };
  }
}
