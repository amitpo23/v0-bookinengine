import type {
  CancellationPolicy,
  CancellationStatus,
} from '@/types/hotel-types';

// Constants
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MILLISECONDS_PER_DAY =
  MILLISECONDS_PER_SECOND *
  SECONDS_PER_MINUTE *
  MINUTES_PER_HOUR *
  HOURS_PER_DAY;
const WARNING_THRESHOLD_DAYS = 3;

/**
 * Determines the current cancellation status based on frames and current date
 */
export function getCurrentCancellationStatus(
  cancellation: CancellationPolicy | null | undefined
): CancellationStatus {
  if (!cancellation?.frames) {
    return {
      isRefundable: false,
      status: 'unknown',
      message: 'Cancellation policy unavailable',
      penalty: null,
    };
  }

  const now = new Date();

  // Find which frame we're currently in
  const currentFrame = cancellation.frames.find((frame) => {
    const fromDate = new Date(frame.from);
    const toDate = new Date(frame.to);
    return now >= fromDate && now <= toDate;
  });

  if (!currentFrame) {
    // We're outside all frames (maybe after check-in)
    return {
      isRefundable: false,
      status: 'expired',
      message: 'Cancellation period has expired',
      penalty: null,
    };
  }

  // Check if current frame has free cancellation
  const isFree = currentFrame.penalty.amount === 0;

  if (isFree) {
    // Find when free cancellation ends
    const freeEndDate = new Date(currentFrame.to);
    const daysUntilEnd = Math.ceil(
      (freeEndDate.getTime() - now.getTime()) / MILLISECONDS_PER_DAY
    );

    // Find what happens after free period
    const nextFrame = cancellation.frames.find((frame) => {
      const fromDate = new Date(frame.from);
      return fromDate > freeEndDate;
    });

    let message = `Free cancellation until ${freeEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    if (nextFrame && nextFrame.penalty.amount > 0) {
      message += ` (then ${nextFrame.penalty.currency} ${nextFrame.penalty.amount} penalty)`;
    }

    return {
      isRefundable: true,
      status: 'free',
      message,
      daysRemaining: daysUntilEnd,
      penalty: { amount: 0, currency: currentFrame.penalty.currency },
      deadline: freeEndDate,
    };
  }
  // We're in a penalty period
  return {
    isRefundable: false,
    status: 'non-refundable',
    message: `Non-refundable (penalty: ${currentFrame.penalty.currency} ${currentFrame.penalty.amount})`,
    penalty: currentFrame.penalty,
  };
}

/**
 * Gets a user-friendly cancellation message
 */
export function getCancellationMessage(
  cancellation: CancellationPolicy | null | undefined
): string {
  const status = getCurrentCancellationStatus(cancellation);

  if (status.status === 'free') {
    if (
      status.daysRemaining &&
      status.daysRemaining <= WARNING_THRESHOLD_DAYS
    ) {
      return `⚠️ Free cancellation (${status.daysRemaining} days left!)`;
    }
    return `✅ ${status.message}`;
  }
  if (status.status === 'non-refundable') {
    return '❌ Non-refundable';
  }
  return '❓ Check cancellation policy';
}

/**
 * Determines the color/style for cancellation display
 */
export function getCancellationStyle(
  cancellation: CancellationPolicy | null | undefined
): string {
  const status = getCurrentCancellationStatus(cancellation);

  if (status.status === 'free') {
    if (
      status.daysRemaining &&
      status.daysRemaining <= WARNING_THRESHOLD_DAYS
    ) {
      return 'text-yellow-600 bg-yellow-50'; // Warning - ending soon
    }
    return 'text-green-600 bg-green-50'; // Safe to cancel
  }
  return 'text-red-600 bg-red-50'; // Non-refundable
}
