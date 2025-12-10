import { NextRequest, NextResponse } from "next/server"

// מיפוי תרגום עברית-אנגלית לערים
const hebrewToEnglish: Record<string, string> = {
  "תל אביב": "tel aviv",
  "תל": "tel",
  "אביב": "aviv",
  "ירושלים": "jerusalem",
  "אילת": "eilat",
  "חיפה": "haifa",
}

// דוגמה למלונות וערים - יותאם למידע אמיתי מה-API שלך
const mockCitiesAndHotels = [
  { id: "city-telaviv", type: "city", name: "תל אביב", nameEn: "tel aviv", count: 5 },
  { id: "hotel-scarlet", type: "hotel", name: "Scarlet Hotel Tel Aviv", nameEn: "scarlet hotel tel aviv", city: "tel aviv" },
  { id: "hotel-royal", type: "hotel", name: "Royal Beach Tel Aviv", nameEn: "royal beach tel aviv", city: "tel aviv" },
  { id: "city-jerusalem", type: "city", name: "ירושלים", nameEn: "jerusalem", count: 8 },
  { id: "city-eilat", type: "city", name: "אילת", nameEn: "eilat", count: 12 },
]

function translateHebrewToEnglish(query: string): string {
  const lowerQuery = query.toLowerCase().trim()
  
  // חיפוש התאמה מלאה
  if (hebrewToEnglish[lowerQuery]) {
    return hebrewToEnglish[lowerQuery]
  }
  
  // חיפוש חלקי
  for (const [heb, eng] of Object.entries(hebrewToEnglish)) {
    if (lowerQuery.includes(heb)) {
      return eng
    }
  }
  
  // אם לא נמצא תרגום, להחזיר את השאילתה כמו שהיא
  return lowerQuery
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    
    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }
    
    // תרגום עברית לאנגלית
    const translatedQuery = translateHebrewToEnglish(query)
    
    // סינון תוצאות
    const results = mockCitiesAndHotels.filter(item => {
      const searchIn = `${item.name} ${item.nameEn}`.toLowerCase()
      return searchIn.includes(query.toLowerCase()) || 
             searchIn.includes(translatedQuery)
    })
    
    return NextResponse.json({ 
      results,
      query,
      translatedQuery 
    })
  } catch (error: any) {
    console.error("Autocomplete API Error:", error)
    return NextResponse.json(
      { error: error.message || "Autocomplete failed" },
      { status: 500 }
    )
  }
}
