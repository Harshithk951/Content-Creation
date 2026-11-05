"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useToast } from "@/components/toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/settings`,
        });

        if (error) {
          toast.error("Reset failed", error.message);
          setLoading(false);
          return;
        }
      }

      setSent(true);
      toast.success("Password reset sent", "Check your inbox for the reset link.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Reset failed";
      toast.error("Reset failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Reset Password</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Enter your email to receive a password reset link.
        </p>
      </div>

      {sent ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Reset Link Sent</span>
          </div>
          <p className="text-zinc-400">
            We've sent a password reset link to <strong className="text-white">{email}</strong>. Please check your inbox.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-brand font-semibold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Creator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="harshith@reelvault.studio"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161822] border border-[#272a3b] text-white text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-bold transition-all shadow-glow hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <span>{loading ? "Sending..." : "Send Reset Link"}</span>
            <Send className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
