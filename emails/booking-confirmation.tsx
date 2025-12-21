import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface BookingConfirmationEmailProps {
  customerName: string
  bookingId: string
  supplierReference: string
  hotelName: string
  roomType: string
  checkIn: string
  checkOut: string
  nights: number
  adults: number
  children: number
  totalPrice: number
  currency: string
  hotelAddress?: string
  hotelPhone?: string
  cancellationPolicy?: string
  language?: "he" | "en"
}

export const BookingConfirmationEmail = ({
  customerName = "John Doe",
  bookingId = "BK123456",
  supplierReference = "HTL789",
  hotelName = "Grand Hotel",
  roomType = "Deluxe Room",
  checkIn = "2024-12-25",
  checkOut = "2024-12-28",
  nights = 3,
  adults = 2,
  children = 0,
  totalPrice = 450,
  currency = "USD",
  hotelAddress = "123 Main St, City",
  hotelPhone = "+1-555-0123",
  cancellationPolicy = "Free cancellation until 24 hours before check-in",
  language = "en",
}: BookingConfirmationEmailProps) => {
  const isHebrew = language === "he"

  const content = {
    en: {
      subject: "Booking Confirmation",
      greeting: `Dear ${customerName},`,
      confirmed: "Your booking has been confirmed! 🎉",
      details: "Booking Details",
      bookingNumber: "Booking Number",
      confirmationNumber: "Confirmation Number",
      hotel: "Hotel",
      room: "Room Type",
      dates: "Check-in / Check-out",
      duration: "Duration",
      guests: "Guests",
      total: "Total Price",
      policy: "Cancellation Policy",
      contact: "Hotel Contact",
      address: "Address",
      phone: "Phone",
      viewBooking: "View Booking",
      questions: "Questions?",
      support: "Contact our support team",
      footer: "Thank you for choosing our booking service!",
      night: "night",
      nights: "nights",
      adult: "adult",
      adults: "adults",
      child: "child",
      children: "children",
    },
    he: {
      subject: "אישור הזמנה",
      greeting: `${customerName} שלום,`,
      confirmed: "!ההזמנה שלך אושרה 🎉",
      details: "פרטי ההזמנה",
      bookingNumber: "מספר הזמנה",
      confirmationNumber: "מספר אישור",
      hotel: "מלון",
      room: "סוג חדר",
      dates: "צ'ק-אין / צ'ק-אאוט",
      duration: "משך השהייה",
      guests: "אורחים",
      total: "מחיר כולל",
      policy: "מדיניות ביטול",
      contact: "פרטי התקשרות למלון",
      address: "כתובת",
      phone: "טלפון",
      viewBooking: "צפה בהזמנה",
      questions: "יש שאלות?",
      support: "צור קשר עם תמיכה",
      footer: "תודה שבחרת בשירות ההזמנות שלנו!",
      night: "לילה",
      nights: "לילות",
      adult: "מבוגר",
      adults: "מבוגרים",
      child: "ילד",
      children: "ילדים",
    },
  }

  const t = content[language]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return isHebrew
      ? date.toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" })
      : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const guestsText = `${adults} ${adults === 1 ? t.adult : t.adults}${children > 0 ? `, ${children} ${children === 1 ? t.child : t.children}` : ""}`

  return (
    <Html dir={isHebrew ? "rtl" : "ltr"}>
      <Head />
      <Preview>
        {t.confirmed} {bookingId}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>{t.confirmed}</Heading>
          </Section>

          {/* Greeting */}
          <Text style={text}>{t.greeting}</Text>
          <Text style={text}>
            {isHebrew
              ? "ההזמנה שלך בוצעה בהצלחה. להלן פרטי ההזמנה:"
              : "Your booking has been successfully completed. Here are your booking details:"}
          </Text>

          <Hr style={hr} />

          {/* Booking Details Box */}
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
                  <td style={labelCell}>{t.confirmationNumber}:</td>
                  <td style={valueCell}>
                    <strong>{supplierReference}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={labelCell}>{t.hotel}:</td>
                  <td style={valueCell}>{hotelName}</td>
                </tr>
                <tr>
                  <td style={labelCell}>{t.room}:</td>
                  <td style={valueCell}>{roomType}</td>
                </tr>
                <tr>
                  <td style={labelCell}>{t.dates}:</td>
                  <td style={valueCell}>
                    {formatDate(checkIn)} - {formatDate(checkOut)}
                  </td>
                </tr>
                <tr>
                  <td style={labelCell}>{t.duration}:</td>
                  <td style={valueCell}>
                    {nights} {nights === 1 ? t.night : t.nights}
                  </td>
                </tr>
                <tr>
                  <td style={labelCell}>{t.guests}:</td>
                  <td style={valueCell}>{guestsText}</td>
                </tr>
                <tr>
                  <td style={labelCell}>{t.total}:</td>
                  <td style={valueCell}>
                    <strong style={price}>
                      {currency} {totalPrice.toFixed(2)}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Hotel Contact */}
          <Section>
            <Heading as="h3" style={h3}>
              {t.contact}
            </Heading>
            <Text style={contactText}>
              <strong>{hotelName}</strong>
            </Text>
            {hotelAddress && (
              <Text style={contactText}>
                {t.address}: {hotelAddress}
              </Text>
            )}
            {hotelPhone && (
              <Text style={contactText}>
                {t.phone}: {hotelPhone}
              </Text>
            )}
          </Section>

          {/* Cancellation Policy */}
          {cancellationPolicy && (
            <>
              <Hr style={hr} />
              <Section>
                <Heading as="h3" style={h3}>
                  {t.policy}
                </Heading>
                <Text style={policyText}>{cancellationPolicy}</Text>
              </Section>
            </>
          )}

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/my-bookings`}>
              {t.viewBooking}
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section>
            <Text style={footer}>
              {t.questions} <Link href="mailto:support@example.com">{t.support}</Link>
            </Text>
            <Text style={footer}>{t.footer}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default BookingConfirmationEmail

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
  backgroundColor: "#4F46E5",
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

const price = {
  color: "#4F46E5",
  fontSize: "18px",
  fontWeight: "700",
}

const contactText = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "4px 20px",
}

const policyText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 20px",
  fontStyle: "italic" as const,
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#4F46E5",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
}

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "8px 20px",
}
