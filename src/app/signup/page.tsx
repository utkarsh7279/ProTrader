"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, TrendingUp, ShieldCheck, Clock, RotateCcw } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(300); // 5 minutes in seconds

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (step !== "verify") return;

    const interval = setInterval(() => {
      setOtpExpiry((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          action: "send-otp",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
        return;
      }

      setSuccess("OTP sent to your email! Check your inbox.");
      setStep("verify");
      setOtpExpiry(300); // Reset timer
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    if (otpExpiry <= 0) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
          action: "verify-otp",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }

      setSuccess("Email verified! Redirecting to dashboard...");
      document.cookie = `userToken=${data.token}; path=/; max-age=86400`;
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userName", formData.name);

      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          action: "resend",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to resend OTP");
        return;
      }

      setSuccess("OTP resent to your email!");
      setOtpExpiry(300); // Reset timer
      setOtp("");
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 10%, rgba(59, 130, 246, 0.12) 0%, transparent 45%), radial-gradient(circle at 80% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">ProTrader</h1>
            </div>
            <p className="text-slate-400 text-sm">
              {step === "register" ? "Create your risk analytics workspace" : "Verify your email address"}
            </p>
          </div>

          <Card className="dense-card border-zinc-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white">
                {step === "register" ? "Create account" : "Verify email"}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {step === "register" ? "Deploy-ready in minutes" : "Enter the 6-digit code sent to your email"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === "register" ? (
                // Register Step
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Aditi Mehta"
                        className="w-full h-10 pl-9 pr-3 text-sm bg-zinc-900/60 border border-zinc-800 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/60"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="desk@fund.com"
                        className="w-full h-10 pl-9 pr-3 text-sm bg-zinc-900/60 border border-zinc-800 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/60"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full h-10 pl-9 pr-9 text-sm bg-zinc-900/60 border border-zinc-800 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/60"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full h-10 pl-9 pr-3 text-sm bg-zinc-900/60 border border-zinc-800 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/60"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-md text-rose-200 text-xs">
                      {error}
                    </div>
                  )}

                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input type="checkbox" required className="rounded border-zinc-700" />
                    I agree to the Terms of Service and Privacy Policy
                  </label>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" /> RBAC enabled by default</span>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm"
                  >
                    {loading ? "Sending OTP..." : "Send Verification Code"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              ) : (
                // Verify Step
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-md">
                    <p className="text-xs text-blue-200">
                      Verification code sent to<br/>
                      <span className="font-semibold text-blue-100">{formData.email}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                      6-Digit Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full h-14 text-center text-2xl font-mono tracking-widest bg-zinc-900/60 border border-zinc-800 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/60"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Expires in {Math.floor(otpExpiry / 60)}:{String(otpExpiry % 60).padStart(2, '0')}
                    </span>
                    {otpExpiry <= 60 && <span className="text-rose-400">Expiring soon</span>}
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-md text-rose-200 text-xs">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-emerald-200 text-xs">
                      {success}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm"
                  >
                    {loading ? "Verifying..." : "Verify & Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || otpExpiry > 250}
                    className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {otpExpiry > 250 ? "Resend code in " + (300 - otpExpiry) + "s" : "Resend code"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("register")}
                    className="w-full text-xs text-slate-400 hover:text-slate-200"
                  >
                    ← Back to registration
                  </button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
