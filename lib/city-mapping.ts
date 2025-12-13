// City name mapping from Hebrew to English for Medici API
// The Medici API only accepts English city names

export const CITY_MAPPING: Record<string, string> = {
  // Israel - Major Cities
  "תל אביב": "Tel Aviv",
  "תל-אביב": "Tel Aviv",
  "ירושלים": "Jerusalem",
  "אילת": "Eilat",
  "חיפה": "Haifa",
  "באר שבע": "Beer Sheva",
  "נתניה": "Netanya",
  "הרצליה": "Herzliya",
  "ראשון לציון": "Rishon LeZion",
  "פתח תקווה": "Petah Tikva",
  "אשדוד": "Ashdod",
  "חולון": "Holon",
  "בני ברק": "Bnei Brak",
  "רמת גן": "Ramat Gan",
  "אשקלון": "Ashkelon",
  "רחובות": "Rehovot",
  "בת ים": "Bat Yam",
  "כפר סבא": "Kfar Saba",
  "טבריה": "Tiberias",
  "נצרת": "Nazareth",
  "רמת השרון": "Ramat HaSharon",
  "יבנה": "Yavne",
  "נהריה": "Nahariya",
  "עכו": "Acre",
  "לוד": "Lod",
  "רמלה": "Ramla",
  "הרצליה": "Herzliya",
  "צפת": "Safed",
  // Dead Sea Area
  "ים המלח": "Dead Sea",
  "אין בוקק": "Ein Bokek",
}

/**
 * Translates a city name from Hebrew to English for Medici API
 * If no mapping exists, returns the original city name
 */
export function translateCityName(cityName: string | undefined): string | undefined {
  if (!cityName) return cityName
  
  // Trim whitespace
  const trimmedCity = cityName.trim()
  
  // Check if mapping exists (case-sensitive for Hebrew)
  if (CITY_MAPPING[trimmedCity]) {
    return CITY_MAPPING[trimmedCity]
  }
  
  // If no mapping found, return original (might already be in English)
  return trimmedCity
}
