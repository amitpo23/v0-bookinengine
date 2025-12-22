export interface Promotion {
  id: string
  title: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minNights?: number
  validFrom: string
  validTo: string
  hotelIds?: number[] // specific hotels, or all if empty
  roomCategories?: number[] // specific categories, or all if empty
  mobileOnly: boolean
  active: boolean
  imageUrl?: string
  terms?: string
}

export interface PromotionApplied {
  promotion: Promotion
  originalPrice: number
  discountAmount: number
  finalPrice: number
}
