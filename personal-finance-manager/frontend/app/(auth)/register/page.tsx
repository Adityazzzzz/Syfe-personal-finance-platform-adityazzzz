"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Eye, EyeOff, Loader2, ShieldCheck, User, Wallet, Zap } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authApi.register(formData);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen items-center gap-12 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-16">
        <section className="max-w-xl space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
            <ShieldCheck className="h-4 w-4 text-foreground" />
            Build a finance workspace
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl text-foreground">
              Start with a clear,
              <span className="block text-primary">confident money plan.</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Create an account to organise spending, align goals, and keep every decision beautifully structured.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Automations", value: "Smart", icon: Zap },
              { label: "Security", value: "Secure", icon: ShieldCheck },
              { label: "Momentum", value: "Live", icon: ArrowUpRight },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-card p-4 shadow-[0_18px_30px_rgba(15,23,42,0.05)]">
                <item.icon className="mb-2 h-5 w-5 text-foreground" />
                <p className="font-display text-2xl text-foreground">{item.value}</p>
                <p className="text-xs uppercase tracking-widest text-subtle">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <Card className="w-full max-w-md border border-border bg-card shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl border border-border bg-foreground flex items-center justify-center">
                <Wallet className="h-6 w-6 text-background" />
              </div>
              <div>
                <CardTitle className="font-display text-2xl text-foreground">Create account</CardTitle>
                <CardDescription className="text-muted-foreground">Let&apos;s set up your finance space.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="h-12 border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Email</Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-12 border-border bg-background pr-10 text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 234 567 890"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
              {error && (
                <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="h-12 w-full bg-foreground text-sm font-semibold uppercase tracking-[0.2em] text-background shadow-lg shadow-black/10 hover:bg-foreground/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-subtle">Already a member?</span>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
