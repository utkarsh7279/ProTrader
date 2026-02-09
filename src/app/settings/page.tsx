"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConsoleShell from "@/components/console/ConsoleShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTheme } from "@/lib/theme-provider";
import { User, Bell, Shield, Palette, Save, LogOut } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { setTheme: applyTheme } = useTheme();
  const [email, setEmail] = useState("user@zerodha.com");
  const [refreshRate, setRefreshRate] = useState("2");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [theme, setTheme] = useState("dark");
  
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [tradeAlerts, setTradeAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setEmail(parsed.email ?? "user@zerodha.com");
      setRefreshRate(parsed.refreshRate ?? "2");
      setTimezone(parsed.timezone ?? "Asia/Kolkata");
      const savedTheme = parsed.theme ?? "dark";
      setTheme(savedTheme);
      setEmailNotifs(parsed.emailNotifs ?? true);
      setSmsNotifs(parsed.smsNotifs ?? false);
      setTradeAlerts(parsed.tradeAlerts ?? true);
      setRiskAlerts(parsed.riskAlerts ?? true);
      setTwoFactorEnabled(parsed.twoFactorEnabled ?? false);
    } catch (error) {
      console.error("Failed to load saved settings", error);
    }
  }, []);

  const handleSave = () => {
    const settings = {
      email,
      refreshRate,
      timezone,
      theme,
      emailNotifs,
      smsNotifs,
      tradeAlerts,
      riskAlerts,
      twoFactorEnabled,
    };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    localStorage.setItem("userEmail", email);
    localStorage.setItem("refreshRate", refreshRate);
    localStorage.setItem("timezone", timezone);
    toast.success("Settings saved", {
      description: "Your preferences have been updated",
    });
  };

  const handleThemeChange = (nextTheme: string) => {
    const themeValue = (nextTheme === "dark" || nextTheme === "light") ? nextTheme : "dark";
    setTheme(themeValue);
    applyTheme(themeValue as "light" | "dark");
    localStorage.setItem("userSettings", JSON.stringify({
      email,
      refreshRate,
      timezone,
      theme: themeValue,
      emailNotifs,
      smsNotifs,
      tradeAlerts,
      riskAlerts,
      twoFactorEnabled,
    }));
    toast.success("Theme updated", {
      description: `Switched to ${themeValue} mode`,
    });
  };

  const handleRefreshRateChange = (rate: string) => {
    setRefreshRate(rate);
    localStorage.setItem("refreshRate", rate);
    toast.success("Refresh rate updated", {
      description: `Data refresh set to ${rate}s`,
    });
  };

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    localStorage.setItem("timezone", value);
    toast.success("Timezone updated", {
      description: `Timezone set to ${value}`,
    });
  };

  const handleChangePassword = () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password too short", {
        description: "Use at least 6 characters",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Confirm your new password",
      });
      return;
    }

    setPasswordUpdating(true);
    setTimeout(() => {
      setPasswordUpdating(false);
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated", {
        description: "Your password has been changed",
      });
    }, 500);
  };

  const handleTwoFactorToggle = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    toast.success(next ? "2FA enabled" : "2FA disabled", {
      description: next ? "Two-factor authentication is now active" : "Two-factor authentication is off",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    document.cookie = "userToken=; path=/; max-age=0";
    toast.success("Logged out", {
      description: "You have been signed out",
    });
    router.push("/login");
  };

  return (
    <ConsoleShell>
      <div className="space-y-6 max-w-[1200px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-100">Settings</h2>
            <p className="text-sm text-neutral-500 mt-1">Manage your account preferences and notifications</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button onClick={handleSave} variant="success" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Account Settings */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-white">Account Settings</CardTitle>
            </div>
            <CardDescription>Personal information and credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-neutral-400">Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-neutral-400">Role</Label>
                <div className="mt-2 flex items-center h-10">
                  <Badge variant="outline" className="text-sm">Risk Analyst</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-neutral-400">User ID</Label>
                <div className="mt-2 text-neutral-500 text-sm font-mono">USR-001234</div>
              </div>
              <div>
                <Label className="text-neutral-400">Account Created</Label>
                <div className="mt-2 text-neutral-500 text-sm">January 15, 2024</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <CardTitle className="text-white">Notification Preferences</CardTitle>
            </div>
            <CardDescription>Configure how you receive alerts and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-200">Email Notifications</div>
                <div className="text-xs text-neutral-500 mt-1">
                  Receive alerts via email
                </div>
              </div>
              <button 
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifs ? 'bg-emerald-600' : 'bg-neutral-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-neutral-300 transition-transform ${
                  emailNotifs ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800/50">
              <div>
                <div className="text-sm text-neutral-200">SMS Alerts</div>
                <div className="text-xs text-neutral-500 mt-1">
                  Get critical alerts via SMS
                </div>
              </div>
              <button 
                onClick={() => setSmsNotifs(!smsNotifs)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  smsNotifs ? 'bg-emerald-600' : 'bg-neutral-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-neutral-300 transition-transform ${
                  smsNotifs ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800/50">
              <div>
                <div className="text-sm text-neutral-200">Trade Confirmations</div>
                <div className="text-xs text-neutral-500 mt-1">
                  Notify on every trade execution
                </div>
              </div>
              <button 
                onClick={() => setTradeAlerts(!tradeAlerts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tradeAlerts ? 'bg-emerald-600' : 'bg-neutral-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-neutral-300 transition-transform ${
                  tradeAlerts ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800/50">
              <div>
                <div className="text-sm text-neutral-200">Risk Limit Alerts</div>
                <div className="text-xs text-neutral-500 mt-1">
                  Get notified when approaching risk limits
                </div>
              </div>
              <button 
                onClick={() => setRiskAlerts(!riskAlerts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  riskAlerts ? 'bg-emerald-600' : 'bg-neutral-700'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-neutral-300 transition-transform ${
                  riskAlerts ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Display & Performance */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-500" />
              <CardTitle className="text-white">Display & Performance</CardTitle>
            </div>
            <CardDescription>Customize interface appearance and data refresh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-neutral-400">Theme</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-neutral-400">Data Refresh Rate</Label>
                <Select value={refreshRate} onValueChange={handleRefreshRateChange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 second</SelectItem>
                    <SelectItem value="2">2 seconds</SelectItem>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-neutral-400">Timezone</Label>
                <Select value={timezone} onValueChange={handleTimezoneChange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-neutral-400">Decimal Precision</Label>
                <Select defaultValue="2">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 decimal</SelectItem>
                    <SelectItem value="2">2 decimals</SelectItem>
                    <SelectItem value="3">3 decimals</SelectItem>
                    <SelectItem value="4">4 decimals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <CardTitle className="text-white">Security</CardTitle>
            </div>
            <CardDescription>Password and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <Label className="text-neutral-400">New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="mt-2"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label className="text-neutral-400">Confirm Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="mt-2"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>
                <Button variant="outline" size="sm" onClick={handleChangePassword} disabled={passwordUpdating}>
                {passwordUpdating ? "Updating..." : "Change Password"}
              </Button>
            </div>
            <div className="pt-3 border-t border-neutral-800/50">
              <div className="text-sm text-neutral-300 mb-3">Two-Factor Authentication</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">
                  Enhance security with 2FA
                </div>
                <Badge variant={twoFactorEnabled ? "success" : "outline"}>
                  {twoFactorEnabled ? "Enabled" : "Not Enabled"}
                </Badge>
              </div>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleTwoFactorToggle}>
                {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </Button>
            </div>
            <div className="pt-3 border-t border-neutral-800/50">
              <div className="text-sm text-neutral-300 mb-2">Active Sessions</div>
              <div className="text-xs text-neutral-500">
                Last login: Today at 9:42 AM from 192.168.1.1
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ConsoleShell>
  );
}
