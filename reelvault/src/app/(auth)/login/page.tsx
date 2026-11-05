"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useToast } from "@/components/toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("harshith@reelvault.studio");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error("Authentication failed", error.message);
          setLoading(false);
          return;
        }
      }

      toast.success("Welcome back, Harshith!", "Access granted to ReelVault Studio.");
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      toast.error("Login failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-white tracking-tight">Studio Access</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Access your personal 100 Days of Free AI video library.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Creator Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="harshith@reelvault.studio"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-brand transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Password</label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-zinc-500 hover:text-white transition-colors font-mono"
            >
              Reset
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-brand transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium transition-colors disabled:opacity-50"
        >
          <span>{loading ? "Authenticating..." : "Enter Studio"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-zinc-500 font-mono">
        Direct studio mode is enabled.{" "}
        <Link href="/" className="text-brand font-medium hover:underline">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
