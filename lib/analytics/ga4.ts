// Google Analytics 4 Event Tracking

export interface GA4Event {
  event: string
  [key: string]: any
}

/**
 * Track a Google Analytics 4 event
 */
export function trackEvent(event: GA4Event) {
  if (typeof window === 'undefined') {
    console.log('[GA4 Debug]', event)
    return
  }

  // @ts-ignore - gtag is injected by Google Analytics
  if (typeof window.gtag === 'function') {
    const { event: eventName, ...params } = event
    // @ts-ignore
    window.gtag('event', eventName, params)
  }
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string) {
  trackEvent({
    event: 'page_view',
    page_location: url,
    page_title: title || document.title
  })
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string, filters?: Record<string, any>) {
  trackEvent({
    event: 'search',
    search_term: searchTerm,
    ...filters
  })
}

/**
 * Track item selection (room type)
 */
export function trackSelectItem(item: {
  item_id: string
  item_name: string
  price: number
  quantity?: number
}) {
  trackEvent({
    event: 'select_item',
    items: [item]
  })
}

/**
 * Track add to cart (room booking intent)
 */
export function trackAddToCart(item: {
  item_id: string
  item_name: string
  price: number
  quantity: number
}) {
  trackEvent({
    event: 'add_to_cart',
    currency: 'ILS',
    value: item.price * item.quantity,
    items: [item]
  })
}

/**
 * Track purchase/booking completion
 */
export function trackPurchase(
  transactionId: string,
  value: number,
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
) {
  trackEvent({
    event: 'purchase',
    transaction_id: transactionId,
    currency: 'ILS',
    value,
    items
  })
}

/**
 * Track promo code application
 */
export function trackApplyPromotion(promotionName: string, discountAmount: number) {
  trackEvent({
    event: 'apply_promotion',
    promotion_name: promotionName,
    discount_amount: discountAmount
  })
}

/**
 * Track loyalty signup
 */
export function trackLoyaltySignup(method: string = 'email') {
  trackEvent({
    event: 'sign_up',
    method,
    category: 'loyalty_program'
  })
}

/**
 * Track affiliate click
 */
export function trackAffiliateClick(affiliateCode: string) {
  trackEvent({
    event: 'affiliate_click',
    affiliate_code: affiliateCode
  })
}

/**
 * Track begin checkout (start payment)
 */
export function trackBeginCheckout(
  value: number,
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>,
  currency: string = 'ILS'
) {
  trackEvent({
    event: 'begin_checkout',
    currency,
    value,
    items
  })
}

/**
 * Track view item (hotel/room viewed)
 */
export function trackViewItem(item: {
  item_id: string
  item_name: string
  price: number
  currency?: string
}) {
  trackEvent({
    event: 'view_item',
    currency: item.currency || 'ILS',
    value: item.price,
    items: [item]
  })
}

/**
 * Track view search results
 */
export function trackViewSearchResults(
  searchTerm: string,
  resultCount: number,
  filters?: Record<string, any>
) {
  trackEvent({
    event: 'view_search_results',
    search_term: searchTerm,
    result_count: resultCount,
    ...filters
  })
}

/**
 * Track form submission (guest details)
 */
export function trackFormSubmit(formName: string, formData?: Record<string, any>) {
  trackEvent({
    event: 'form_submit',
    form_name: formName,
    ...formData
  })
}

/**
 * Track payment method selection
 */
export function trackPaymentMethod(method: string, isStripe?: boolean) {
  trackEvent({
    event: 'add_payment_info',
    payment_type: method,
    is_stripe: isStripe || false
  })
}

/**
 * Track prebook timeout/expiry
 */
export function trackPrebookExpiry(hotelId: string, roomId: string, timeRemaining: number) {
  trackEvent({
    event: 'prebook_expiry',
    hotel_id: hotelId,
    room_id: roomId,
    time_remaining_seconds: timeRemaining
  })
}

/**
 * Track loyalty points usage
 */
export function trackLoyaltyPointsUsed(
  pointsUsed: number,
  discountValue: number,
  tier: string
) {
  trackEvent({
    event: 'loyalty_points_used',
    points_used: pointsUsed,
    discount_value: discountValue,
    loyalty_tier: tier
  })
}

/**
 * Track affiliate conversion
 */
export function trackAffiliateConversion(
  affiliateCode: string,
  transactionId: string,
  value: number
) {
  trackEvent({
    event: 'affiliate_conversion',
    affiliate_code: affiliateCode,
    transaction_id: transactionId,
    value
  })
}

/**
 * Track booking step change
 */
export function trackBookingStep(step: string, hotelId?: string, roomId?: string) {
  trackEvent({
    event: 'booking_step',
    step_name: step,
    hotel_id: hotelId,
    room_id: roomId
  })
}

/**
 * Track error events
 */
export function trackError(errorType: string, errorMessage: string, context?: Record<string, any>) {
  trackEvent({
    event: 'error',
    error_type: errorType,
    error_message: errorMessage,
    ...context
  })
}
