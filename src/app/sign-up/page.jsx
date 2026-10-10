"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSignUp(event) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      const message = "দুইটি পাসওয়ার্ড মিলছে না।";
      setError(message);
      toast.error(message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (signUpError) {
        const message = signUpError.message || "অ্যাকাউন্ট তৈরি করা যায়নি।";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
      router.replace("/sign-in");
    } catch {
      const message = "সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="bg-[#f2f5f1] min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            বাজারদরের বিস্তারিত দেখতে নিবন্ধন করুন।
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <form
            onSubmit={handleSignUp}
            onInvalidCapture={() =>
              toast.error("নাম, ইমেইল ও বৈধ পাসওয়ার্ড দিন।")
            }
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-xs font-bold text-slate-700"
              >
                নাম
              </label>
              <input
                id="name"
                placeholder="আপনার নাম লিখুন"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/30 text-slate-800 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-700"
              >
                ইমেইল
              </label>
              <input
                id="email"
                type="email"
                placeholder="আপনার ইমেইল এড্রেস লিখুন"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/30 text-slate-800 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-700"
              >
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/30 text-slate-800 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirm-password"
                className="block text-xs font-bold text-slate-700"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                id="confirm-password"
                placeholder="আপনার নিশ্চিত পাসওয়ার্ড লিখুন"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError("");
                }}
                aria-invalid={passwordMismatch}
                aria-describedby={
                  passwordMismatch ? "confirm-password-feedback" : undefined
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/30 text-slate-800 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
              />
              <p
                id="confirm-password-feedback"
                aria-live="polite"
                className={`text-xs ${passwordMismatch ? "text-rose-600" : "sr-only"}`}
              >
                {passwordMismatch ? "পাসওয়ার্ড দুটি মিলছে না।" : ""}
              </p>
            </div>

            {error && (
              <p role="alert" className="text-sm text-rose-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#058b42] hover:bg-[#047738] disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow-sm"
            >
              {isSubmitting ? "তৈরি হচ্ছে..." : "সাইন আপ"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 font-medium pt-6">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/sign-in"
              className="text-[#058b42] font-bold hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
