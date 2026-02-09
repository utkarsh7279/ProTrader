"use client";
import { useState } from "react";

export default function TestAuth() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("Test123!@#");
  const [name, setName] = useState("Test User");
  const [otp, setOtp] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [step, setStep] = useState<"signup" | "verify">("signup");

  const handleSignup = async () => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          action: "send-otp",
        }),
      });

      const data = await res.json();
      setResponse(data);

      if (data.devOtp) {
        setOtp(data.devOtp);
        setStep("verify");
      }
    } catch (err) {
      console.error(err);
      setResponse({ error: String(err) });
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          action: "verify-otp",
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse({ error: String(err) });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          🧪 Auth Testing Page
        </h1>

        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">
            {step === "signup" ? "Step 1: Signup" : "Step 2: Verify OTP"}
          </h2>

          {step === "signup" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSignup}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Send OTP
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                <p className="text-green-300 text-sm mb-2">✅ OTP Sent Successfully!</p>
                <p className="text-2xl font-bold text-center text-green-400">{otp}</p>
                <p className="text-xs text-green-300 text-center mt-2">
                  (Auto-filled for testing)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-mono"
                  maxLength={6}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("signup")}
                  className="flex-1 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handleVerify}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}
        </div>

        {response && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4">📡 API Response</h3>
            <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-900 border border-blue-700 rounded-lg">
          <h3 className="font-bold mb-2">💡 Testing Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-200">
            <li>Fill in the signup form (or use pre-filled values)</li>
            <li>Click "Send OTP" - the OTP will appear automatically</li>
            <li>The OTP is also logged in the terminal console</li>
            <li>Click "Verify OTP" to complete registration</li>
            <li>Check the API response below for success/error messages</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
