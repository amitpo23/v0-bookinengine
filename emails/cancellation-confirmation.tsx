import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface CancellationConfirmationEmailProps {
  customerName: string
  bookingId: string
  hotelName: string
  checkIn: string
  checkOut: string
  totalPrice: number
  currency: string
  refundAmount?: number
  refundDate?: string
  cancellationReason?: string
  language?: "he" | "en"
}

export const CancellationConfirmationEmail = ({
  customerName = "John Doe",
  bookingId = "BK123456",
  hotelName = "Grand Hotel",
  checkIn = "2024-12-25",
  checkOut = "2024-12-28",
  totalPrice = 450,
  currency = "USD",
  refundAmount,
  refundDate,
  cancellationReason,
  language = "en",
}: CancellationConfirmationEmailProps) => {
  const isHebrew = language === "he"

  const content = {
    en: {
      subject: "Booking Cancellation Confirmed",
      greeting: `Dear ${customerName},`,
      cancelled: "Your booking has been cancelled",
      message: "We confirm that your booking has been successfully cancelled.",
      details: "Cancelled Booking Details",
      bookingNumber: "Booking Number",
      hotel: "Hotel",
      dates: "Original Dates",
      originalPrice: "Original Price",
      refund: "Refund Information",
      refundAmount: "Refund Amount",
      refundDate: "Expected Refund Date",
      noRefund: "This booking was non-refundable. No refund will be issued.",
      reason: "Cancellation Reason",
      sorry: "We're sorry to see you go!",
      future: "We hope to serve you again in the future.",
      questions: "Questions about your cancellation?",
      support: "Contact our support team at support@example.com",
    },
    he: {
      subject: "אישור ביטול הזמנה",
      greeting: `${customerName} שלום,`,
      cancelled: "ההזמנה שלך בוטלה",
      message: "אנו מאשרים שההזמנה שלך בוטלה בהצלחה.",
      details: "פרטי ההזמנה המבוטלת",
      bookingNumber: "מספר הזמנה",
      hotel: "מלון",
      dates: "תאריכים מקוריים",
      originalPrice: "מחיר מקורי",
      refund: "מידע על החזר כספי",
      refundAmount: "סכום החזר",
      refundDate: "תאריך החזר משוער",
      noRefund: "הזמנה זו הייתה ללא אפשרות החזר. לא יינתן החזר כספי.",
      reason: "סיבת הביטול",
      sorry: "!אנו מצטערים לראותך עוזב",
      future: "נשמח לארח אותך שוב בעתיד.",
      questions: "יש שאלות לגבי הביטול?",
      support: "support@example.com צור קשר עם תמיכה בכתובת",
    },
  }

  const t = content[language]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return isHebrew
      ? date.toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" })
      : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <Html dir={isHebrew ? "rtl" : "ltr"}>
      <Head />
      <Preview>
        {t.cancelled} - {bookingId}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>{t.cancelled}</Heading>
          </Section>

          {/* Greeting */}
          <Text style={text}>{t.greeting}</Text>
          <Text style={text}>{t.message}</Text>

          <Hr style={hr} />

          {/* Booking Details */}
          <Section style={detailsBox}>
            <Heading as="h2" style={h2}>
              {t.details}
            </Heading>

            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>{t.bookingNumber}:</td>
                  <td style={valueCell}>
                    <strong>{bookingId}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={labelCell}>{t.hotel}:</td>
                  <td style={valueCell}>{hotelName}</td>
                </tr>
                <tr>
                  <td style={labelCell}>{t.dates}:</td>
                  <td style={valueCell}>
                    {formatDate(checkIn)} - {formatDate(checkOut)}
                  </td>
                </tr>
                <tr>
                  <td style={labelCell}>{t.originalPrice}:</td>
                  <td style={valueCell}>
                    {currency} {totalPrice.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Cancellation Reason */}
          {cancellationReason && (
            <Section style={reasonBox}>
              <Heading as="h3" style={h3}>
                {t.reason}
              </Heading>
              <Text style={reasonText}>{cancellationReason}</Text>
            </Section>
          )}

          {/* Refund Information */}
          <Hr style={hr} />
          <Section style={refundBox}>
            <Heading as="h2" style={h2}>
              {t.refund}
            </Heading>

            {refundAmount && refundAmount > 0 ? (
              <table style={table}>
                <tbody>
                  <tr>
                    <td style={labelCell}>{t.refundAmount}:</td>
                    <td style={valueCell}>
                      <strong style={refundPrice}>
                        {currency} {refundAmount.toFixed(2)}
                      </strong>
                    </td>
                  </tr>
                  {refundDate && (
                    <tr>
                      <td style={labelCell}>{t.refundDate}:</td>
                      <td style={valueCell}>{formatDate(refundDate)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <Text style={noRefundText}>{t.noRefund}</Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section>
            <Text style={sorryText}>{t.sorry}</Text>
            <Text style={text}>{t.future}</Text>
            <Text style={footer}>{t.questions}</Text>
            <Text style={footer}>{t.support}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default CancellationConfirmationEmail

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "8px",
}

const header = {
  padding: "32px 20px",
  backgroundColor: "#DC2626",
  borderRadius: "8px 8px 0 0",
}

const h1 = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0",
  padding: "0",
  textAlign: "center" as const,
}

const h2 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 20px",
}

const h3 = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 12px",
}

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 20px",
}

const detailsBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "24px",
  margin: "20px",
}

const reasonBox = {
  margin: "20px",
}

const reasonText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
  fontStyle: "italic" as const,
}

const refundBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #fbbf24",
  borderRadius: "8px",
  padding: "24px",
  margin: "20px",
}

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
}

const labelCell = {
  color: "#6b7280",
  fontSize: "14px",
  paddingBottom: "12px",
  paddingRight: "16px",
  verticalAlign: "top" as const,
  width: "40%",
}

const valueCell = {
  color: "#1f2937",
  fontSize: "14px",
  paddingBottom: "12px",
  fontWeight: "500",
}

const refundPrice = {
  color: "#059669",
  fontSize: "18px",
  fontWeight: "700",
}

const noRefundText = {
  color: "#DC2626",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
  fontWeight: "500",
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
}

const sorryText = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "20px",
}

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "8px 20px",
}
