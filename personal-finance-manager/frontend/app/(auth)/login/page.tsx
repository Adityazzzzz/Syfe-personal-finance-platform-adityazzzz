"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Eye, EyeOff, Loader2, ShieldCheck, TrendingUp, Wallet } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authApi.login({ username, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
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
            Secure finance workspace
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl text-foreground">
              Make money feel
              <span className="block text-primary">clear and composed.</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Track income, plan goals, and surface every rupee in a calm interface inspired by modern product studios.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Monthly lift", value: "+32%", icon: TrendingUp },
              { label: "Protected", value: "Secure", icon: ShieldCheck },
              { label: "Sync speed", value: "1s", icon: ArrowUpRight },
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
                <CardTitle className="font-display text-2xl text-foreground">Welcome back</CardTitle>
                <CardDescription className="text-muted-foreground">Log in to access your money overview.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Email</Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="name@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    Signing in...
                  </>
                ) : (
                  "Sign In"
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
                <span className="bg-card px-3 text-subtle">New here?</span>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Create account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
