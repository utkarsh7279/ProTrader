import nodemailer from 'nodemailer';
import Redis from 'ioredis';

// Redis client for OTP storage with better error handling
let redis: Redis | null = null;

// Initialize Redis connection safely
const initRedis = () => {
  if (redis) return redis;
  
  try {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      console.warn('⚠️ REDIS_URL not configured - using in-memory OTP storage (development only)');
      return null;
    }
    
    redis = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      lazyConnect: true,
    });
    
    redis.on('error', (err) => {
      console.warn('⚠️ Redis connection error:', err.message);
      redis = null;
    });
    
    redis.on('connect', () => {
      console.log('✓ Connected to Redis');
    });
    
    return redis;
  } catch (err) {
    console.warn('⚠️ Failed to initialize Redis:', err instanceof Error ? err.message : String(err));
    return null;
  }
};

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
    const redisClient = initRedis();
    
    if (redisClient) {
      await redisClient.setex(`otp:${email}`, expirationSeconds, otp);
      console.log(`[OTP] ✓ Stored OTP for ${email} in Redis, expires in ${expirationSeconds}s`);
      return otp;
    } else {
      throw new Error('Redis client not available or not connected');
    }
  } catch (err) {
    // Fallback to in-memory storage for development
    console.log(`[OTP] ⚠️ Could not use Redis, falling back to memory:`, err instanceof Error ? err.message : String(err));
    const expiresAt = Date.now() + expirationSeconds * 1000;
    otpStore.set(email, { code: otp, expiresAt });
    console.log(`[OTP] Stored in memory: Email: ${email}, Code: ${otp}, Expires: ${new Date(expiresAt).toISOString()}`);
  }

  return otp;
};

// Verify OTP
export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const redisClient = initRedis();
    
    if (redisClient) {
      const storedOtp = await redisClient.get(`otp:${email}`);
      
      if (!storedOtp) {
        console.log(`[OTP Verify] ✗ No OTP found in Redis for ${email}`);
        return false;
      }

      if (storedOtp !== otp) {
        console.log(`[OTP Verify] ✗ OTP mismatch for ${email}. Expected: ${storedOtp}, Got: ${otp}`);
        return false;
      }

      // OTP verified, delete from Redis
      await redisClient.del(`otp:${email}`);
      console.log(`[OTP Verify] ✓ OTP verified and cleared for ${email}`);
      return true;
    } else {
      throw new Error('Redis client not available');
    }
  } catch (err) {
    // Fallback to in-memory storage for development
    console.log(`[OTP Verify] ⚠️ Cannot use Redis, trying memory:`, err instanceof Error ? err.message : String(err));
    const stored = otpStore.get(email);

    if (!stored) {
      console.log(`[OTP Verify] ✗ No OTP found for ${email}`);
      return false;
    }

    // Check expiration
    if (Date.now() > stored.expiresAt) {
      console.log(`[OTP Verify] ✗ OTP expired for ${email}`);
      otpStore.delete(email);
      return false;
    }

    // Check OTP match
    if (stored.code !== otp) {
      console.log(`[OTP Verify] ✗ OTP mismatch for ${email}. Expected: ${stored.code}, Got: ${otp}`);
      return false;
    }

    // OTP verified, remove from store
    console.log(`[OTP Verify] ✓ OTP verified and cleared for ${email}`);
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
  console.log(`Email User: ${process.env.EMAIL_USER ? '✓ Set' : '✗ NOT SET'}`);
  console.log(`Email Password: ${process.env.EMAIL_PASSWORD ? '✓ Set' : '✗ NOT SET'}`);
  console.log('='.repeat(60) + '\n');
  
  // If no email config, just log (development mode)
  if (!hasEmailConfig) {
    console.warn('⚠️  Email credentials not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env to send real emails.');
    return true;
  }

  // Send actual email to inbox
  try {
    console.log(`[OTP] Attempting to send email via Gmail SMTP...`);
    const transporter = getEmailTransporter();
    
    // Test transporter before sending
    await transporter.verify();
    console.log('[OTP] ✓ Gmail credentials verified');

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
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error: any) {
    console.error('❌ Error sending OTP email:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Full Error:', error);
    
    // Provide helpful debugging info for common issues
    if (error.code === 'EAUTH') {
      console.error('💡 Authentication failed - Check EMAIL_USER and EMAIL_PASSWORD in .env');
      console.error('💡 For Gmail, use an App Password (not your regular password)');
      console.error('💡 Enable "Less secure app access" or use Gmail App Passwords');
    }
    
    return false;
  }
};

// Get OTP expiration time remaining (in seconds)
export const getOTPExpirationTime = async (email: string): Promise<number> => {
  try {
    const redisClient = initRedis();
    
    if (redisClient) {
      const ttl = await redisClient.ttl(`otp:${email}`);
      return Math.max(0, ttl); // Redis returns -1 if key doesn't exist, -2 if expired
    } else {
      throw new Error('Redis not available');
    }
  } catch (err) {
    // Fallback to in-memory storage for development
    const stored = otpStore.get(email);
    if (!stored) return 0;

    const remaining = Math.max(0, Math.floor((stored.expiresAt - Date.now()) / 1000));
    return remaining;
  }
};
