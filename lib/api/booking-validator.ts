// Booking Validator - בדיקות לפני הזמנה
import { preBookManager } from './prebook-manager'
import type { GuestDetails } from './booking-service'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export class BookingValidator {
  /**
   * בדיקה מלאה לפני Book
   */
  async validateBooking(params: {
    roomCode: string
    token: string
    guestDetails: GuestDetails
    priceConfirmed: number
  }): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    // 1. בדיקת PreBook תקף
    const preBook = preBookManager.getPreBook(params.roomCode)
    if (!preBook) {
      errors.push('PreBook expired or not found. Please search again.')
    } else {
      const timeRemaining = preBookManager.getTimeRemaining(params.roomCode)
      if (timeRemaining < 2) {
        warnings.push(`PreBook expires in ${timeRemaining} minutes. Complete booking quickly!`)
      }
    }

    // 2. בדיקת Token
    if (!params.token || params.token.length < 5) {
      errors.push('Invalid booking token')
    }

    // 3. בדיקת פרטי אורח
    const guestErrors = this.validateGuestDetails(params.guestDetails)
    errors.push(...guestErrors)

    // 4. בדיקת מחיר
    if (params.priceConfirmed <= 0) {
      errors.push('Invalid price')
    }

    // 5. בדיקת התאמת Token ל-PreBook
    if (preBook && preBook.token !== params.token) {
      errors.push('Token mismatch. Please try PreBook again.')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * בדיקת פרטי אורח
   */
  private validateGuestDetails(guest: GuestDetails): string[] {
    const errors: string[] = []

    if (!guest.firstName || guest.firstName.length < 2) {
      errors.push('First name is required (min 2 characters)')
    }

    if (!guest.lastName || guest.lastName.length < 2) {
      errors.push('Last name is required (min 2 characters)')
    }

    if (!guest.email || !this.isValidEmail(guest.email)) {
      errors.push('Valid email is required')
    }

    if (!guest.phone || guest.phone.length < 10) {
      errors.push('Valid phone number is required')
    }

    if (!guest.country || guest.country.length !== 2) {
      errors.push('Country code is required (2 letters)')
    }

    if (!['MR', 'MRS', 'MS'].includes(guest.title)) {
      errors.push('Title must be MR, MRS, or MS')
    }

    return errors
  }

  /**
   * בדיקת אימייל תקין
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * בדיקת טווח תאריכים תקין
   */
  validateDates(checkIn: string, checkOut: string): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // תאריך צ'ק-אין לא יכול להיות בעבר
    if (checkInDate < today) {
      errors.push('Check-in date cannot be in the past')
    }

    // צ'ק-אאוט חייב להיות אחרי צ'ק-אין
    if (checkOutDate <= checkInDate) {
      errors.push('Check-out must be after check-in')
    }

    // אזהרה על הזמנה רחוקה מדי
    const daysUntilCheckIn = Math.floor((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntilCheckIn > 365) {
      warnings.push('Booking is more than 1 year in advance')
    }

    // אזהרה על שהייה ארוכה
    const nights = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    if (nights > 30) {
      warnings.push('Long stay detected (more than 30 nights)')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * בדיקת מספר אורחים תקין
   */
  validateGuests(adults: number, children: number[]): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (adults < 1) {
      errors.push('At least 1 adult is required')
    }

    if (adults > 10) {
      warnings.push('Large number of adults. Consider multiple rooms.')
    }

    if (children.length > 5) {
      warnings.push('Large number of children. Consider multiple rooms.')
    }

    // בדיקת גילאי ילדים
    for (const age of children) {
      if (age < 0 || age > 17) {
        errors.push(`Invalid child age: ${age}. Must be 0-17.`)
      }
    }

    const totalGuests = adults + children.length
    if (totalGuests > 15) {
      warnings.push('Very large group. Consider splitting into multiple reservations.')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }
}

export const bookingValidator = new BookingValidator()
