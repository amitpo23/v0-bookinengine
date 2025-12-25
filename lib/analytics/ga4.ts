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
