import { NextRequest, NextResponse } from 'next/server';
import { getOTPExpirationTime } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { email, action } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    if (action === 'resend') {
      // Resend OTP logic
      const { storeOTP, sendOTPEmail } = await import('@/lib/otp');
      
      const otpCode = await storeOTP(email);
      const emailSent = await sendOTPEmail(email, otpCode, 'User');

      if (!emailSent) {
        return NextResponse.json(
          { message: 'Failed to resend OTP' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: 'OTP resent to your email' },
        { status: 200 }
      );
    }

    if (action === 'check-expiry') {
      // Check remaining time for OTP
      const expiryTime = await getOTPExpirationTime(email);

      if (expiryTime <= 0) {
        return NextResponse.json(
          { message: 'OTP expired', expired: true },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: 'OTP valid', expiryTime, expired: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
