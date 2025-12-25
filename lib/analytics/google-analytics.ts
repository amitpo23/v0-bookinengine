// Google Analytics 4 (GA4) Integration
// Tracks events and conversions

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""

// Initialize GA4
export const initGA = () => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return

  // Load gtag script
  const script = document.createElement("script")
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  script.async = true
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  gtag("js", new Date())
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  })
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Generic event tracking
export const event = (action: string, params?: Record<string, any>) => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return

  window.gtag("event", action, params)
}

// ========================================
// E-COMMERCE EVENTS
// ========================================

// View search results
export const trackSearchResults = (params: {
  searchTerm?: string
  checkIn: string
  checkOut: string
  guests: number
  resultsCount: number
}) => {
  event("view_search_results", {
    search_term: params.searchTerm,
    check_in: params.checkIn,
    check_out: params.checkOut,
    guests: params.guests,
    results_count: params.resultsCount,
  })
}

// View item (hotel room)
export const trackViewItem = (params: {
  itemId: string
  itemName: string
  itemCategory: string
  price: number
  currency?: string
}) => {
  event("view_item", {
    currency: params.currency || "ILS",
    value: params.price,
    items: [
      {
        item_id: params.itemId,
        item_name: params.itemName,
        item_category: params.itemCategory,
        price: params.price,
      },
    ],
  })
}

// Add to cart (select room)
export const trackSelectRoom = (params: {
  itemId: string
  itemName: string
  itemCategory: string
  price: number
  currency?: string
  nights: number
}) => {
  event("add_to_cart", {
    currency: params.currency || "ILS",
    value: params.price,
    items: [
      {
        item_id: params.itemId,
        item_name: params.itemName,
        item_category: params.itemCategory,
        price: params.price,
        quantity: params.nights,
      },
    ],
  })
}

// Begin checkout
export const trackBeginCheckout = (params: {
  value: number
  currency?: string
  items: Array<{
    itemId: string
    itemName: string
    price: number
    quantity: number
  }>
}) => {
  event("begin_checkout", {
    currency: params.currency || "ILS",
    value: params.value,
    items: params.items.map((item) => ({
      item_id: item.itemId,
      item_name: item.itemName,
      price: item.price,
      quantity: item.quantity,
    })),
  })
}

// Add payment info
export const trackAddPaymentInfo = (params: {
  value: number
  currency?: string
  paymentType?: string
}) => {
  event("add_payment_info", {
    currency: params.currency || "ILS",
    value: params.value,
    payment_type: params.paymentType,
  })
}

// Purchase (booking completed)
export const trackPurchase = (params: {
  transactionId: string
  value: number
  currency?: string
  tax?: number
  items: Array<{
    itemId: string
    itemName: string
    itemCategory: string
    price: number
    quantity: number
  }>
  promoCode?: string
  loyaltyDiscount?: number
}) => {
  event("purchase", {
    transaction_id: params.transactionId,
    value: params.value,
    currency: params.currency || "ILS",
    tax: params.tax || 0,
    coupon: params.promoCode,
    items: params.items.map((item) => ({
      item_id: item.itemId,
      item_name: item.itemName,
      item_category: item.itemCategory,
      price: item.price,
      quantity: item.quantity,
    })),
  })

  // Track loyalty discount separately if applicable
  if (params.loyaltyDiscount) {
    event("loyalty_discount_applied", {
      discount_amount: params.loyaltyDiscount,
      transaction_id: params.transactionId,
    })
  }
}

// ========================================
// CUSTOM EVENTS
// ========================================

// Promo code applied
export const trackPromoCodeApplied = (params: {
  code: string
  discountAmount: number
  discountType: string
}) => {
  event("promo_code_applied", {
    promo_code: params.code,
    discount_amount: params.discountAmount,
    discount_type: params.discountType,
  })
}

// Loyalty club join
export const trackLoyaltyJoin = (params: { tier: string }) => {
  event("loyalty_join", {
    tier: params.tier,
  })
}

// Share hotel/room
export const trackShare = (params: { method: string; itemId: string; itemName: string }) => {
  event("share", {
    method: params.method,
    content_type: "room",
    item_id: params.itemId,
    item_name: params.itemName,
  })
}

// Like/Favorite hotel/room
export const trackLike = (params: { itemId: string; itemName: string }) => {
  event("like", {
    content_type: "room",
    item_id: params.itemId,
    item_name: params.itemName,
  })
}

// Filter applied
export const trackFilterApplied = (params: {
  filterType: string
  filterValue: string | string[]
}) => {
  event("filter_applied", {
    filter_type: params.filterType,
    filter_value: Array.isArray(params.filterValue)
      ? params.filterValue.join(",")
      : params.filterValue,
  })
}

// Sort changed
export const trackSortChanged = (params: { sortBy: string }) => {
  event("sort_changed", {
    sort_by: params.sortBy,
  })
}

// AI Chat interaction
export const trackAIChatMessage = (params: { messageType: string; intent?: string }) => {
  event("ai_chat_message", {
    message_type: params.messageType,
    intent: params.intent,
  })
}

// Template view
export const trackTemplateView = (params: { templateName: string }) => {
  event("template_view", {
    template_name: params.templateName,
  })
}

// ========================================
// TYPE DECLARATIONS
// ========================================

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (command: string, ...args: any[]) => void
  }
}
