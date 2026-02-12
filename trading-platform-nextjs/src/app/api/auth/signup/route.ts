import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storeOTP, sendOTPEmail } from '@/lib/otp';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, action, otp } = await request.json();

    // Step 1: Initial signup - send OTP
    if (action === 'send-otp') {
      if (!name || !email || !password) {
        return NextResponse.json(
          { message: 'Name, email, and password are required' },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      }).catch(() => null);

      if (existingUser) {
        return NextResponse.json(
          { message: 'Email already registered' },
          { status: 409 }
        );
      }

      // Generate and store OTP
      const otpCode = await storeOTP(email);
      
      // Send OTP email
      const emailSent = await sendOTPEmail(email, otpCode, name);

      if (!emailSent) {
        return NextResponse.json(
          { message: 'Failed to send verification email' },
          { status: 500 }
        );
      }

      // Store signup data temporarily (in production, use Redis or database)
      const tempData = {
        name,
        email,
        password,
        timestamp: Date.now(),
      };

      // Development mode - include OTP in response
      const isDevelopment = process.env.NODE_ENV !== 'production';
      const responseData: any = {
        message: 'OTP sent to your email. Verify to complete registration.',
        step: 'verify-otp',
        requiresVerification: true,
      };

      if (isDevelopment) {
        responseData.devOtp = otpCode;
        responseData.devMessage = 'Development Mode: OTP is included in response. Check console for details.';
      }

      const response = NextResponse.json(responseData, { status: 200 });

      // Store temp signup data in cookie
      response.cookies.set('_signup_temp', JSON.stringify(tempData), {
        httpOnly: true,
        maxAge: 600, // 10 minutes
        sameSite: 'lax',
      });

      return response;
    }

    // Step 2: Verify OTP and complete signup
    if (action === 'verify-otp') {
      if (!otp || !email) {
        return NextResponse.json(
          { message: 'OTP and email are required' },
          { status: 400 }
        );
      }

      // Import OTP verification function
      const { verifyOTP } = await import('@/lib/otp');

      // Verify OTP
      if (!(await verifyOTP(email, otp.toString()))) {
        return NextResponse.json(
          { message: 'Invalid or expired OTP' },
          { status: 401 }
        );
      }

      // Get signup data from cookie
      const signupCookie = request.cookies.get('_signup_temp')?.value;
      if (!signupCookie) {
        return NextResponse.json(
          { message: 'Signup session expired. Please start over.' },
          { status: 400 }
        );
      }

      const signupData = JSON.parse(signupCookie);

      // Verify data hasn't been tampered
      if (signupData.email !== email) {
        return NextResponse.json(
          { message: 'Email mismatch. Please start over.' },
          { status: 400 }
        );
      }

      // Hash password
      const passwordHash = await bcrypt.hash(signupData.password, 10);

      // Create user with account in transaction
      const user = await prisma.user.create({
        data: {
          name: signupData.name,
          email: signupData.email,
          passwordHash,
          role: 'operator',
          account: {
            create: {
              balance: 0,
            },
          },
        },
        include: {
          account: true,
        },
      }).catch((err) => {
        console.error('User creation error:', err);
        return null;
      });

      if (!user) {
        return NextResponse.json(
          { message: 'Failed to create user account' },
          { status: 500 }
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = NextResponse.json(
        {
          message: 'Email verified! Account created successfully',
          token,
          user: { id: user.id, email: user.email, name: user.name },
        },
        { status: 201 }
      );

      response.cookies.set('userToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400,
      });

      // Clear temp signup data
      response.cookies.set('_signup_temp', '', { maxAge: 0 });

      return response;
    }

    return NextResponse.json(
      { message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
