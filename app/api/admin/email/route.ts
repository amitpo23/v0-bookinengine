import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { emailService } from '@/lib/email/email-service';

// GET - Check email service status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userRole = (session.user as any)?.role;
    if (!userRole || !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const isEnabled = emailService.isEnabled();
    
    return NextResponse.json({
      enabled: isEnabled,
      provider: 'Resend',
      configured: !!process.env.RESEND_API_KEY,
      fromEmail: process.env.FROM_EMAIL || 'bookings@youraitravelagent.com',
      fromName: process.env.FROM_NAME || 'Booking Engine',
    });
  } catch (error) {
    console.error('Error checking email status:', error);
    return NextResponse.json(
      { error: 'Failed to check email status' },
      { status: 500 }
    );
  }
}

// POST - Test email service
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userRole = (session.user as any)?.role;
    if (!userRole || !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, testEmail } = await request.json();

    if (action === 'test' && testEmail) {
      // Send a test booking confirmation
      const result = await emailService.sendBookingConfirmation({
        to: testEmail,
        customerName: 'Test User',
        bookingId: 'TEST-' + Date.now(),
        supplierReference: 'REF-TEST',
        hotelName: 'Test Hotel',
        roomType: 'Deluxe Room',
        checkIn: 'Jan 01, 2025',
        checkOut: 'Jan 03, 2025',
        nights: 2,
        adults: 2,
        children: 0,
        totalPrice: 250,
        currency: 'USD',
        language: 'en',
      });

      return NextResponse.json({
        success: result.success,
        emailId: result.emailId,
        error: result.error,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error testing email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to test email' },
      { status: 500 }
    );
  }
}
