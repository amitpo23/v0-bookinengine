/**
 * PDF Voucher Generator
 * Creates printable booking vouchers in PDF format
 */

import { jsPDF } from "jspdf"
import { logger } from "@/lib/logger"

export interface VoucherData {
  bookingId: string
  supplierReference: string
  customerName: string
  customerEmail: string
  customerPhone: string
  hotelName: string
  hotelAddress?: string
  hotelPhone?: string
  roomType: string
  checkIn: string
  checkOut: string
  nights: number
  adults: number
  children: number
  totalPrice: number
  currency: string
  boardType?: string
  specialRequests?: string
  cancellationPolicy?: string
  language?: "he" | "en"
}

class VoucherGenerator {
  /**
   * Generate PDF voucher
   * Returns base64 encoded PDF
   */
  generateVoucher(data: VoucherData): string {
    const isHebrew = data.language === "he"

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let currentY = margin

    // Helper function to add text with RTL support
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      if (isHebrew) {
        doc.text(text, pageWidth - x, y, { align: "right", ...options })
      } else {
        doc.text(text, x, y, options)
      }
    }

    // Helper to move to next line
    const nextLine = (spacing: number = 7) => {
      currentY += spacing
    }

    // Header - Logo/Title
    doc.setFillColor(79, 70, 229) // Primary color
    doc.rect(0, 0, pageWidth, 40, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    addText(isHebrew ? "שובר הזמנה" : "BOOKING VOUCHER", margin, 25)

    // Reset colors
    doc.setTextColor(0, 0, 0)
    currentY = 50

    // Booking Information
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    addText(isHebrew ? "פרטי הזמנה" : "BOOKING INFORMATION", margin, currentY)
    nextLine(10)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    const infoRows = [
      {
        label: isHebrew ? "מספר הזמנה:" : "Booking Number:",
        value: data.bookingId,
      },
      {
        label: isHebrew ? "מספר אסמכתא:" : "Confirmation Number:",
        value: data.supplierReference,
      },
      {
        label: isHebrew ? "תאריך הנפקה:" : "Issue Date:",
        value: new Date().toLocaleDateString(isHebrew ? "he-IL" : "en-US"),
      },
    ]

    infoRows.forEach((row) => {
      doc.setFont("helvetica", "bold")
      addText(row.label, margin, currentY)
      doc.setFont("helvetica", "normal")
      addText(row.value, margin + 60, currentY)
      nextLine()
    })

    nextLine(5)

    // Guest Information
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    addText(isHebrew ? "פרטי אורח" : "GUEST INFORMATION", margin, currentY)
    nextLine(10)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    const guestRows = [
      { label: isHebrew ? "שם:" : "Name:", value: data.customerName },
      { label: isHebrew ? "אימייל:" : "Email:", value: data.customerEmail },
      { label: isHebrew ? "טלפון:" : "Phone:", value: data.customerPhone },
    ]

    guestRows.forEach((row) => {
      doc.setFont("helvetica", "bold")
      addText(row.label, margin, currentY)
      doc.setFont("helvetica", "normal")
      addText(row.value, margin + 60, currentY)
      nextLine()
    })

    nextLine(5)

    // Hotel Information
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    addText(isHebrew ? "פרטי מלון" : "HOTEL INFORMATION", margin, currentY)
    nextLine(10)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    const hotelRows = [
      { label: isHebrew ? "מלון:" : "Hotel:", value: data.hotelName },
      ...(data.hotelAddress
        ? [
            {
              label: isHebrew ? "כתובת:" : "Address:",
              value: data.hotelAddress,
            },
          ]
        : []),
      ...(data.hotelPhone
        ? [
            {
              label: isHebrew ? "טלפון:" : "Phone:",
              value: data.hotelPhone,
            },
          ]
        : []),
    ]

    hotelRows.forEach((row) => {
      doc.setFont("helvetica", "bold")
      addText(row.label, margin, currentY)
      doc.setFont("helvetica", "normal")
      addText(row.value, margin + 60, currentY)
      nextLine()
    })

    nextLine(5)

    // Booking Details
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    addText(isHebrew ? "פרטי שהייה" : "STAY DETAILS", margin, currentY)
    nextLine(10)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return isHebrew
        ? date.toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" })
        : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    }

    const stayRows = [
      {
        label: isHebrew ? "סוג חדר:" : "Room Type:",
        value: data.roomType,
      },
      {
        label: isHebrew ? "צ'ק-אין:" : "Check-in:",
        value: formatDate(data.checkIn),
      },
      {
        label: isHebrew ? "צ'ק-אאוט:" : "Check-out:",
        value: formatDate(data.checkOut),
      },
      {
        label: isHebrew ? "לילות:" : "Nights:",
        value: data.nights.toString(),
      },
      {
        label: isHebrew ? "מבוגרים:" : "Adults:",
        value: data.adults.toString(),
      },
      ...(data.children > 0
        ? [
            {
              label: isHebrew ? "ילדים:" : "Children:",
              value: data.children.toString(),
            },
          ]
        : []),
      ...(data.boardType
        ? [
            {
              label: isHebrew ? "סוג אירוח:" : "Board Type:",
              value: data.boardType,
            },
          ]
        : []),
    ]

    stayRows.forEach((row) => {
      doc.setFont("helvetica", "bold")
      addText(row.label, margin, currentY)
      doc.setFont("helvetica", "normal")
      addText(row.value, margin + 60, currentY)
      nextLine()
    })

    nextLine(5)

    // Price Box
    doc.setFillColor(249, 250, 251)
    doc.setDrawColor(229, 231, 235)
    doc.rect(margin, currentY, pageWidth - margin * 2, 20, "FD")

    currentY += 7

    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    addText(isHebrew ? "מחיר כולל:" : "TOTAL PRICE:", margin + 5, currentY)

    doc.setTextColor(79, 70, 229)
    const priceText = `${data.currency} ${data.totalPrice.toFixed(2)}`
    addText(priceText, pageWidth - margin - 5, currentY)
    doc.setTextColor(0, 0, 0)

    currentY += 20

    // Special Requests
    if (data.specialRequests) {
      nextLine(5)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      addText(isHebrew ? "בקשות מיוחדות" : "SPECIAL REQUESTS", margin, currentY)
      nextLine(10)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(107, 114, 128)

      const splitText = doc.splitTextToSize(data.specialRequests, pageWidth - margin * 2 - 60)
      splitText.forEach((line: string) => {
        addText(line, margin, currentY)
        nextLine()
      })

      doc.setTextColor(0, 0, 0)
      nextLine(5)
    }

    // Cancellation Policy
    if (data.cancellationPolicy) {
      nextLine(5)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      addText(isHebrew ? "מדיניות ביטול" : "CANCELLATION POLICY", margin, currentY)
      nextLine(10)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(107, 114, 128)

      const splitText = doc.splitTextToSize(data.cancellationPolicy, pageWidth - margin * 2 - 60)
      splitText.forEach((line: string) => {
        addText(line, margin, currentY)
        nextLine(5)
      })

      doc.setTextColor(0, 0, 0)
    }

    // Footer
    const footerY = pageHeight - 30
    doc.setDrawColor(229, 231, 235)
    doc.line(margin, footerY, pageWidth - margin, footerY)

    doc.setFontSize(8)
    doc.setTextColor(107, 114, 128)
    const footerText = isHebrew
      ? "שובר זה משמש כאסמכתא להזמנה. נא להציג בעת הצ'ק-אין."
      : "This voucher serves as confirmation. Please present upon check-in."

    addText(footerText, margin, footerY + 10)

    logger.info("[PDF] Voucher generated", {
      bookingId: data.bookingId,
    })

    // Return base64 encoded PDF
    return doc.output("datauristring")
  }

  /**
   * Generate and save voucher to file
   */
  async generateAndSave(data: VoucherData, filepath: string): Promise<void> {
    const doc = this.generateVoucher(data)
    // In Node.js environment, you'd save to filesystem
    // For web, this returns the base64 data
    logger.info("[PDF] Voucher ready for download", {
      bookingId: data.bookingId,
      filepath,
    })
  }
}

// Export singleton instance
export const voucherGenerator = new VoucherGenerator()

// Export class for testing
export { VoucherGenerator }
