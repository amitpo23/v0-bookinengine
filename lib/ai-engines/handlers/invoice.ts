/**
 * Invoice Handler
 * Generate and send booking invoices/receipts
 */

// Types
export interface InvoiceContext {
  userId?: string
  sessionId?: string
  locale?: "en" | "he"
}

export interface InvoiceData {
  invoiceNumber: string
  bookingId: string
  date: Date
  dueDate?: Date
  
  // Seller info
  seller: {
    name: string
    address: string
    email: string
    phone: string
    vatNumber?: string
  }
  
  // Customer info
  customer: {
    name: string
    email: string
    phone?: string
    address?: string
  }
  
  // Booking details
  booking: {
    hotelName: string
    roomType: string
    checkIn: Date
    checkOut: Date
    nights: number
    guests: number
    confirmationNumber: string
  }
  
  // Line items
  items: InvoiceItem[]
  
  // Totals
  subtotal: number
  tax: number
  taxRate: number
  discount?: number
  discountCode?: string
  total: number
  currency: string
  
  // Payment info
  paymentMethod?: string
  paymentStatus: "pending" | "paid" | "refunded" | "partial"
  paidAmount?: number
  paidAt?: Date
  
  // Notes
  notes?: string
  termsAndConditions?: string
}

export interface InvoiceItem {
  description: string
  descriptionHe?: string
  quantity: number
  unitPrice: number
  total: number
}

export interface GeneratedInvoice {
  invoiceNumber: string
  html: string
  pdfUrl?: string
  createdAt: Date
}

/**
 * Generate invoice number
 */
function generateInvoiceNumber(bookingId: string): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `INV-${year}${month}-${random}`
}

/**
 * Calculate nights between dates
 */
function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Format currency
 */
function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  })
  return formatter.format(amount / 100) // Convert from cents
}

/**
 * Format date
 */
function formatDate(date: Date, locale: "en" | "he" = "en"): string {
  return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

/**
 * Generate invoice HTML
 */
export async function generateInvoice(
  params: {
    bookingId: string
    hotelName: string
    roomType: string
    checkIn: string | Date
    checkOut: string | Date
    totalPrice: number
    currency: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    confirmationNumber: string
    guests: number
    taxRate?: number
    discount?: number
    discountCode?: string
    paymentStatus?: "pending" | "paid" | "refunded" | "partial"
    notes?: string
  },
  context?: InvoiceContext
): Promise<GeneratedInvoice> {
  console.log("[Invoice] Generating invoice", { bookingId: params.bookingId })

  const locale = context?.locale || "en"
  const checkIn = new Date(params.checkIn)
  const checkOut = new Date(params.checkOut)
  const nights = calculateNights(checkIn, checkOut)
  
  const invoiceNumber = generateInvoiceNumber(params.bookingId)
  const taxRate = params.taxRate || 17 // Default 17% VAT in Israel
  const subtotal = params.totalPrice
  const tax = Math.round(subtotal * taxRate / 100)
  const discount = params.discount || 0
  const total = subtotal + tax - discount

  const invoiceData: InvoiceData = {
    invoiceNumber,
    bookingId: params.bookingId,
    date: new Date(),
    seller: {
      name: "Booking Engine Ltd",
      address: "123 Tech Street, Tel Aviv, Israel",
      email: "billing@bookingengine.com",
      phone: "+972-3-1234567",
      vatNumber: "IL-123456789",
    },
    customer: {
      name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone,
    },
    booking: {
      hotelName: params.hotelName,
      roomType: params.roomType,
      checkIn,
      checkOut,
      nights,
      guests: params.guests,
      confirmationNumber: params.confirmationNumber,
    },
    items: [
      {
        description: `${params.hotelName} - ${params.roomType}`,
        descriptionHe: `${params.hotelName} - ${params.roomType}`,
        quantity: nights,
        unitPrice: Math.round(subtotal / nights),
        total: subtotal,
      },
    ],
    subtotal,
    tax,
    taxRate,
    discount,
    discountCode: params.discountCode,
    total,
    currency: params.currency,
    paymentStatus: params.paymentStatus || "pending",
    notes: params.notes,
  }

  // Generate HTML
  const html = generateInvoiceHTML(invoiceData, locale)

  console.log("[Invoice] Invoice generated", { invoiceNumber })

  return {
    invoiceNumber,
    html,
    createdAt: new Date(),
  }
}

/**
 * Generate HTML invoice template
 */
function generateInvoiceHTML(data: InvoiceData, locale: "en" | "he"): string {
  const isHebrew = locale === "he"
  const dir = isHebrew ? "rtl" : "ltr"
  
  const labels = isHebrew ? {
    invoice: "חשבונית",
    invoiceNumber: "מספר חשבונית",
    date: "תאריך",
    from: "מאת",
    to: "אל",
    bookingDetails: "פרטי הזמנה",
    hotel: "מלון",
    roomType: "סוג חדר",
    checkIn: "צ'ק-אין",
    checkOut: "צ'ק-אאוט",
    nights: "לילות",
    guests: "אורחים",
    confirmation: "מספר אישור",
    description: "תיאור",
    quantity: "כמות",
    unitPrice: "מחיר ליחידה",
    total: "סה\"כ",
    subtotal: "סכום ביניים",
    tax: "מע\"מ",
    discount: "הנחה",
    grandTotal: "סה\"כ לתשלום",
    status: "סטטוס תשלום",
    paid: "שולם",
    pending: "ממתין לתשלום",
    refunded: "הוחזר",
    partial: "שולם חלקית",
    notes: "הערות",
    thankYou: "תודה על הזמנתך!",
  } : {
    invoice: "Invoice",
    invoiceNumber: "Invoice Number",
    date: "Date",
    from: "From",
    to: "To",
    bookingDetails: "Booking Details",
    hotel: "Hotel",
    roomType: "Room Type",
    checkIn: "Check-in",
    checkOut: "Check-out",
    nights: "Nights",
    guests: "Guests",
    confirmation: "Confirmation #",
    description: "Description",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    total: "Total",
    subtotal: "Subtotal",
    tax: "Tax (VAT)",
    discount: "Discount",
    grandTotal: "Grand Total",
    status: "Payment Status",
    paid: "Paid",
    pending: "Pending",
    refunded: "Refunded",
    partial: "Partially Paid",
    notes: "Notes",
    thankYou: "Thank you for your booking!",
  }

  const statusLabel = {
    paid: labels.paid,
    pending: labels.pending,
    refunded: labels.refunded,
    partial: labels.partial,
  }[data.paymentStatus]

  const statusColor = {
    paid: "#22c55e",
    pending: "#f59e0b",
    refunded: "#ef4444",
    partial: "#3b82f6",
  }[data.paymentStatus]

  return `
<!DOCTYPE html>
<html dir="${dir}" lang="${isHebrew ? "he" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${labels.invoice} ${data.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: ${isHebrew ? "'Heebo', 'Arial', sans-serif" : "'Inter', 'Arial', sans-serif"};
      line-height: 1.6; 
      color: #1f2937;
      background: #f9fafb;
      padding: 20px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 { font-size: 28px; font-weight: 700; }
    .invoice-number { 
      background: rgba(255,255,255,0.2);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
    }
    .content { padding: 30px; }
    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    .party h3 { 
      color: #6366f1; 
      margin-bottom: 10px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .party p { color: #4b5563; font-size: 14px; }
    .booking-details {
      background: #f3f4f6;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .booking-details h3 {
      color: #1f2937;
      margin-bottom: 15px;
      font-size: 16px;
    }
    .booking-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }
    .booking-item label {
      display: block;
      color: #6b7280;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .booking-item span {
      font-weight: 600;
      color: #1f2937;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      text-align: ${isHebrew ? "right" : "left"};
      padding: 12px;
      background: #f9fafb;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e5e7eb;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .totals {
      margin-top: 20px;
      border-top: 2px solid #e5e7eb;
      padding-top: 20px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .total-row.grand {
      font-size: 18px;
      font-weight: 700;
      color: #6366f1;
      border-top: 2px solid #6366f1;
      margin-top: 10px;
      padding-top: 15px;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: white;
      background: ${statusColor};
    }
    .footer {
      text-align: center;
      padding: 20px;
      background: #f9fafb;
      color: #6b7280;
      font-size: 14px;
    }
    @media print {
      body { background: white; padding: 0; }
      .invoice-container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div>
        <h1>${labels.invoice}</h1>
        <p>${labels.date}: ${formatDate(data.date, locale)}</p>
      </div>
      <div class="invoice-number">
        ${labels.invoiceNumber}: ${data.invoiceNumber}
      </div>
    </div>
    
    <div class="content">
      <div class="parties">
        <div class="party">
          <h3>${labels.from}</h3>
          <p><strong>${data.seller.name}</strong></p>
          <p>${data.seller.address}</p>
          <p>${data.seller.email}</p>
          <p>${data.seller.phone}</p>
          ${data.seller.vatNumber ? `<p>VAT: ${data.seller.vatNumber}</p>` : ""}
        </div>
        <div class="party">
          <h3>${labels.to}</h3>
          <p><strong>${data.customer.name}</strong></p>
          <p>${data.customer.email}</p>
          ${data.customer.phone ? `<p>${data.customer.phone}</p>` : ""}
          ${data.customer.address ? `<p>${data.customer.address}</p>` : ""}
        </div>
      </div>
      
      <div class="booking-details">
        <h3>${labels.bookingDetails}</h3>
        <div class="booking-grid">
          <div class="booking-item">
            <label>${labels.hotel}</label>
            <span>${data.booking.hotelName}</span>
          </div>
          <div class="booking-item">
            <label>${labels.roomType}</label>
            <span>${data.booking.roomType}</span>
          </div>
          <div class="booking-item">
            <label>${labels.confirmation}</label>
            <span>${data.booking.confirmationNumber}</span>
          </div>
          <div class="booking-item">
            <label>${labels.checkIn}</label>
            <span>${formatDate(data.booking.checkIn, locale)}</span>
          </div>
          <div class="booking-item">
            <label>${labels.checkOut}</label>
            <span>${formatDate(data.booking.checkOut, locale)}</span>
          </div>
          <div class="booking-item">
            <label>${labels.nights} / ${labels.guests}</label>
            <span>${data.booking.nights} / ${data.booking.guests}</span>
          </div>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>${labels.description}</th>
            <th>${labels.quantity}</th>
            <th>${labels.unitPrice}</th>
            <th>${labels.total}</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>${isHebrew && item.descriptionHe ? item.descriptionHe : item.description}</td>
              <td>${item.quantity}</td>
              <td>${formatCurrency(item.unitPrice, data.currency)}</td>
              <td>${formatCurrency(item.total, data.currency)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      
      <div class="totals">
        <div class="total-row">
          <span>${labels.subtotal}</span>
          <span>${formatCurrency(data.subtotal, data.currency)}</span>
        </div>
        <div class="total-row">
          <span>${labels.tax} (${data.taxRate}%)</span>
          <span>${formatCurrency(data.tax, data.currency)}</span>
        </div>
        ${data.discount ? `
        <div class="total-row">
          <span>${labels.discount}${data.discountCode ? ` (${data.discountCode})` : ""}</span>
          <span>-${formatCurrency(data.discount, data.currency)}</span>
        </div>
        ` : ""}
        <div class="total-row grand">
          <span>${labels.grandTotal}</span>
          <span>${formatCurrency(data.total, data.currency)}</span>
        </div>
      </div>
      
      <div style="margin-top: 20px;">
        <strong>${labels.status}:</strong>
        <span class="status-badge">${statusLabel}</span>
      </div>
      
      ${data.notes ? `
      <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px;">
        <strong>${labels.notes}:</strong>
        <p>${data.notes}</p>
      </div>
      ` : ""}
    </div>
    
    <div class="footer">
      <p>${labels.thankYou}</p>
    </div>
  </div>
</body>
</html>
`
}

/**
 * Send invoice via email
 */
export async function sendInvoiceEmail(
  params: {
    to: string
    invoiceNumber: string
    invoiceHtml: string
    bookingId: string
    customerName: string
  },
  context?: InvoiceContext
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log("[Invoice] Sending invoice email", { to: params.to, invoiceNumber: params.invoiceNumber })

  try {
    // Use Resend directly for custom HTML emails
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY || "")
    
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || "bookings@youraitravelagent.com",
      to: params.to,
      subject: `Invoice ${params.invoiceNumber} - Your Booking Confirmation`,
      html: params.invoiceHtml,
    })

    console.log("[Invoice] Invoice email sent", { messageId: result.data?.id })

    return {
      success: true,
      messageId: result.data?.id,
    }
  } catch (error: any) {
    console.error("[Invoice] Failed to send invoice email", error.message)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Get invoice by booking ID
 */
export async function getInvoice(
  params: { bookingId: string },
  context?: InvoiceContext
): Promise<GeneratedInvoice | null> {
  // In a real implementation, this would fetch from database
  // For now, return null as invoices are generated on-demand
  console.log("[Invoice] Getting invoice for booking", { bookingId: params.bookingId })
  return null
}

/**
 * Generate receipt (simplified invoice for completed payments)
 */
export async function generateReceipt(
  params: {
    bookingId: string
    paymentId: string
    amount: number
    currency: string
    customerName: string
    customerEmail: string
    hotelName: string
    confirmationNumber: string
  },
  context?: InvoiceContext
): Promise<GeneratedInvoice> {
  console.log("[Invoice] Generating receipt", { bookingId: params.bookingId })

  // Generate a simplified invoice/receipt
  return generateInvoice({
    bookingId: params.bookingId,
    hotelName: params.hotelName,
    roomType: "Standard Room",
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000),
    totalPrice: params.amount,
    currency: params.currency,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    confirmationNumber: params.confirmationNumber,
    guests: 2,
    paymentStatus: "paid",
    notes: `Payment ID: ${params.paymentId}`,
  }, context)
}

// Export handlers map for registry
export const invoiceHandlers = {
  generateInvoice,
  sendInvoiceEmail,
  getInvoice,
  generateReceipt,
}
