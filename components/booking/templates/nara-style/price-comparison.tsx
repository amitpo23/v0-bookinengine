"use client"

interface PriceSource {
  name: string
  price: number
  logo?: string
}

interface PriceComparisonProps {
  sitePrice: number
  otherPrices?: PriceSource[]
  currency?: string
}

export function PriceComparison({ sitePrice, otherPrices = [], currency = "₪" }: PriceComparisonProps) {
  const defaultOtherPrices: PriceSource[] = [
    { name: "Booking.com", price: sitePrice + 60 },
    { name: "Priceline", price: sitePrice + 60 },
  ]

  const prices = otherPrices.length > 0 ? otherPrices : defaultOtherPrices

  return (
    <div className="flex w-full" dir="rtl">
      {/* Site Price - Highlighted */}
      <div className="flex-1 bg-gray-800 text-white py-3 px-6 flex items-center justify-center gap-2">
        <span className="text-lg font-bold">
          {sitePrice} {currency}
        </span>
        <span className="text-sm">המחיר באתר</span>
      </div>

      {/* Other Prices */}
      {prices.map((source, index) => (
        <div
          key={index}
          className="flex-1 bg-white border border-gray-200 py-3 px-6 flex items-center justify-center gap-2"
        >
          <span className="text-lg font-medium text-gray-600">
            {source.price} {currency}
          </span>
          <span className="text-sm text-gray-500">{source.name}</span>
        </div>
      ))}
    </div>
  )
}
