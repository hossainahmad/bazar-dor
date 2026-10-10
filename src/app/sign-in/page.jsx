"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import SocialAuthButtons from "../components/SocialAuthButtons";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const socialResult = searchParams.get("socialResult");
  const redirectTo =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (callbackUrl && socialResult !== "error") {
      toast.info(
        callbackUrl.startsWith("/profile")
          ? "প্রোফাইল দেখতে আগে সাইন ইন করুন।"
          : "সুরক্ষিত পণ্য দেখতে আগে সাইন ইন করুন।",
        {
          id: "protected-route-sign-in",
        },
      );
    }
  }, [callbackUrl, socialResult]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        const message =
          signInError.message || "সাইন ইন করা যায়নি। তথ্যগুলো যাচাই করুন।";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে।");
      router.replace(redirectTo);
      router.refresh();
    } catch {
      const message = "সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Top Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          সাইন ইন
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <form
          onSubmit={handleLogin}
          onInvalidCapture={() => toast.error("ইমেইল ও পাসওয়ার্ড পূরণ করুন।")}
          className="space-y-4"
        >
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-700"
            >
              ইমেইল
            </label>
            <input
              type="email"
              placeholder="আপনার ইমেইল লিখুন"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/30 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-slate-700"
            >
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/30 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-rose-600">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#058b42] hover:bg-[#047738] disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-sm mt-2"
          >
            {isSubmitting ? "যাচাই হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>
        <SocialAuthButtons
          callbackURL={redirectTo}
          errorURL={
            callbackUrl
              ? `/sign-in?callbackUrl=${encodeURIComponent(redirectTo)}&socialResult=error`
              : "/sign-in?socialResult=error"
          }
        />
        {/* Footer */}
        <p className="text-center text-xs text-slate-600 font-medium pt-2">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/sign-up"
            className="text-[#058b42] font-bold hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      {/* Back to Home Link */}
      <div className="text-center pt-1">
        <Link
          href="/"
          className="text-xs text-slate-500 font-medium hover:text-slate-800 transition-colors inline-flex items-center gap-1"
        >
          <span>←</span> হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="bg-[#f2f5f1] min-h-screen px-4 pt-6 pb-12 flex items-start justify-center sm:pt-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md h-80 rounded-2xl bg-white animate-pulse" />
        }
      >
        <SignInForm />
      </Suspense>
    </main>
  );
}
