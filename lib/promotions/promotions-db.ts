import type { Promotion } from "./types"

const promotions: Promotion[] = [
  {
    id: "MOBILE_FLASH_2024",
    title: "מבצע פלאש - הזמנה מהמובייל!",
    description: "קבלו 20% הנחה על כל ההזמנות מהמובייל - מוגבל לשעות הקרובות בלבד!",
    discountType: "percentage",
    discountValue: 20,
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    mobileOnly: true,
    active: true,
    imageUrl: "/mobile-flash-sale.jpg",
    terms: "ההנחה תקפה להזמנות מהמובייל בלבד. לא ניתן לשלב עם מבצעים אחרים.",
  },
  {
    id: "EARLY_BIRD_2024",
    title: "מבצע הזמנה מוקדמת",
    description: "הזמינו 30 יום מראש וקבלו 15% הנחה!",
    discountType: "percentage",
    discountValue: 15,
    minNights: 2,
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    mobileOnly: false,
    active: true,
    imageUrl: "/early-bird-discount.jpg",
    terms: "ההנחה תקפה להזמנות של 2 לילות לפחות. תאריכי שהייה לפי זמינות.",
  },
  {
    id: "WEEKEND_SPECIAL",
    title: 'מבצע סופ"ש',
    description: '500 ₪ הנחה על חבילות סופ"ש!',
    discountType: "fixed",
    discountValue: 500,
    minNights: 2,
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    mobileOnly: false,
    active: true,
    imageUrl: "/weekend-getaway.png",
    terms: "תקף לשישי-שבת בלבד. מינימום 2 לילות.",
  },
]

export function getAllPromotions(): Promotion[] {
  return promotions.filter((p) => p.active)
}

export function getActivePromotions(isMobile: boolean): Promotion[] {
  return promotions.filter((p) => {
    if (!p.active) return false
    if (p.mobileOnly && !isMobile) return false

    const now = new Date()
    const validFrom = new Date(p.validFrom)
    const validTo = new Date(p.validTo)

    return now >= validFrom && now <= validTo
  })
}

export function getPromotionById(id: string): Promotion | undefined {
  return promotions.find((p) => p.id === id)
}

export function addPromotion(promotion: Promotion): void {
  promotions.push(promotion)
}

export function updatePromotion(id: string, updates: Partial<Promotion>): boolean {
  const index = promotions.findIndex((p) => p.id === id)
  if (index === -1) return false

  promotions[index] = { ...promotions[index], ...updates }
  return true
}

export function deletePromotion(id: string): boolean {
  const index = promotions.findIndex((p) => p.id === id)
  if (index === -1) return false

  promotions.splice(index, 1)
  return true
}

export function calculateDiscount(
  promotion: Promotion,
  price: number,
  nights: number,
): { discountAmount: number; finalPrice: number } {
  if (promotion.minNights && nights < promotion.minNights) {
    return { discountAmount: 0, finalPrice: price }
  }

  let discountAmount = 0

  if (promotion.discountType === "percentage") {
    discountAmount = (price * promotion.discountValue) / 100
  } else {
    discountAmount = promotion.discountValue
  }

  discountAmount = Math.min(discountAmount, price)
  const finalPrice = Math.max(0, price - discountAmount)

  return { discountAmount, finalPrice }
}
