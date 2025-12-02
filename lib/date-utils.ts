// Custom date formatting utilities without date-fns dependency

export function formatDate(date: Date, locale: "he" | "en" = "he"): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  }
  return date.toLocaleDateString(locale === "he" ? "he-IL" : "en-US", options)
}

export function formatDateShort(date: Date, locale: "he" | "en" = "he"): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }
  return date.toLocaleDateString(locale === "he" ? "he-IL" : "en-US", options)
}

export function formatDateLong(date: Date, locale: "he" | "en" = "he"): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  return date.toLocaleDateString(locale === "he" ? "he-IL" : "en-US", options)
}

export function formatTime(date: Date, locale: "he" | "en" = "he"): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  }
  return date.toLocaleTimeString(locale === "he" ? "he-IL" : "en-US", options)
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function subDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

export function differenceInDays(dateLeft: Date, dateRight: Date): number {
  const diffTime = Math.abs(dateLeft.getTime() - dateRight.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function eachDayOfInterval(start: Date, end: Date): Date[] {
  const days: Date[] = []
  const current = new Date(start)
  while (current <= end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return days
}

export function getMonthName(date: Date, locale: "he" | "en" = "he"): string {
  return date.toLocaleDateString(locale === "he" ? "he-IL" : "en-US", { month: "long" })
}

export function getYear(date: Date): number {
  return date.getFullYear()
}

export function formatDateForApi(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
