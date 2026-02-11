import nodemailer from 'nodemailer';
import Redis from 'ioredis';

// Redis client for OTP storage
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Store for development (when Redis not available)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// Initialize email transporter (Gmail example - configure with your credentials)
const getEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password',
    },
  });
};

// Generate OTP (6-digit code)
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiration (5 minutes)
export const storeOTP = async (email: string): Promise<string> => {
  const otp = generateOTP();
  const expirationSeconds = 5 * 60; // 5 minutes

  try {
    // Try to use Redis
    if (redis) {
      await redis.setex(`otp:${email}`, expirationSeconds, otp);
      console.log(`[OTP] Redis: Stored OTP for ${email}, expires in ${expirationSeconds}s`);
    } else {
      throw new Error('Redis not available');
    }
  } catch (err) {
    // Fallback to in-memory storage for development
    console.log(`[OTP] Fallback to memory: ${err}`);
    const expiresAt = Date.now() + expirationSeconds * 1000;
    otpStore.set(email, { code: otp, expiresAt });
    console.log(`[OTP] Email: ${email}, Code: ${otp}, Expires: ${new Date(expiresAt).toISOString()}`);
  }

  return otp;
};

// Verify OTP
export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    // Try Redis first
    if (redis) {
      const storedOtp = await redis.get(`otp:${email}`);
      
      if (!storedOtp) {
        console.log(`[OTP Verify] No OTP found in Redis for ${email}`);
        return false;
      }

      if (storedOtp !== otp) {
        console.log(`[OTP Verify] OTP mismatch for ${email}. Expected: ${storedOtp}, Got: ${otp}`);
        return false;
      }

      // OTP verified, delete from Redis
      await redis.del(`otp:${email}`);
      console.log(`[OTP Verify] ✓ OTP verified successfully for ${email}`);
      return true;
    } else {
      throw new Error('Redis not available');
    }
  } catch (err) {
    // Fallback to in-memory storage for development
    console.log(`[OTP Verify] Fallback to memory: ${err}`);
    const stored = otpStore.get(email);

    if (!stored) {
      console.log(`[OTP Verify] No OTP found for ${email}`);
      return false;
    }

    // Check expiration
    if (Date.now() > stored.expiresAt) {
      console.log(`[OTP Verify] OTP expired for ${email}`);
      otpStore.delete(email);
      return false;
    }

    // Check OTP match
    if (stored.code !== otp) {
      console.log(`[OTP Verify] OTP mismatch for ${email}. Expected: ${stored.code}, Got: ${otp}`);
      return false;
    }

    // OTP verified, remove from store
    console.log(`[OTP Verify] ✓ OTP verified successfully for ${email}`);
    otpStore.delete(email);
    return true;
  }
};

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string, name: string): Promise<boolean> => {
  // Check if email credentials are configured
  const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
  
  // Log OTP for development/debugging
  console.log('\n' + '='.repeat(60));
  console.log(`📧 OTP EMAIL ${!hasEmailConfig ? '(NO EMAIL CONFIG - CONSOLE ONLY)' : '(SENDING)'}`);
  console.log('='.repeat(60));
  console.log(`To: ${email}`);
  console.log(`Name: ${name}`);
  console.log(`OTP Code: ${otp}`);
  console.log(`Expires: ${new Date(Date.now() + 5 * 60 * 1000).toLocaleString()}`);
  console.log('='.repeat(60) + '\n');
  
  // If no email config, just log (development mode)
  if (!hasEmailConfig) {
    console.warn('⚠️  Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env to send real emails.');
    return true;
  }

  // Send actual email to inbox
  try {
    const transporter = getEmailTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'ProTrader - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 20px; border-radius: 8px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 30px; border-radius: 8px; border: 1px solid #334155;">
            <h2 style="color: #3b82f6; text-align: center; margin-bottom: 20px;">Email Verification</h2>
            
            <p style="color: #e2e8f0; font-size: 16px; margin-bottom: 10px;">Hello ${name},</p>
            
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              Welcome to ProTrader! To complete your account registration, please verify your email address using the OTP code below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; border: 2px dashed #3b82f6;">
                <p style="color: #3b82f6; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0;">
                  ${otp}
                </p>
              </div>
            </div>
            
            <p style="color: #cbd5e1; font-size: 14px; margin: 20px 0;">
              This OTP will expire in <strong>5 minutes</strong>. If you did not request this code, please ignore this email.
            </p>
            
            <div style="border-top: 1px solid #334155; margin-top: 30px; padding-top: 20px;">
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                ProTrader © 2026 | AI Trading &amp; Portfolio Risk Analytics<br>
                This is an automated message, please do not reply.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    return false;
  }
};

// Get OTP expiration time remaining (in seconds)
export const getOTPExpirationTime = async (email: string): Promise<number> => {
  try {
    // Try Redis first
    if (redis) {
      const ttl = await redis.ttl(`otp:${email}`);
      return Math.max(0, ttl); // Redis returns -1 if key doesn't exist, -2 if expired
    } else {
      throw new Error('Redis not available');
    }
  } catch (err) {
    // Fallback to in-memory storage for development
    console.log(`[OTP Expiry] Fallback to memory: ${err}`);
    const stored = otpStore.get(email);
    if (!stored) return 0;

    const remaining = Math.max(0, Math.floor((stored.expiresAt - Date.now()) / 1000));
    return remaining;
  }
};
