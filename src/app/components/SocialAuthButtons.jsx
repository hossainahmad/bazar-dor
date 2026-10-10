"use client";

import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const providers = [
  { id: "google", label: "Google", Icon: FcGoogle },
  { id: "github", label: "GitHub", Icon: FaGithub },
];

export default function SocialAuthButtons({
  callbackURL = "/",
  errorURL = "/sign-in",
}) {
  const [pendingProvider, setPendingProvider] = useState(null);

  function getResultURL(status, destination) {
    const params = new URLSearchParams({
      status,
      next: destination,
    });
    return `/auth/social/callback?${params.toString()}`;
  }

  async function handleSocialSignIn(provider) {
    setPendingProvider(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: getResultURL("success", callbackURL),
        newUserCallbackURL: getResultURL("signup", callbackURL),
        errorCallbackURL: getResultURL("error", errorURL),
      });

      if (error) {
        toast.error(error.message || `${provider} দিয়ে সাইন ইন করা যায়নি।`);
      }
    } catch {
      toast.error("সামাজিক সাইন-ইন শুরু করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setPendingProvider(null);
    }
  }

  return (
    <section
      aria-label="সামাজিক অ্যাকাউন্ট দিয়ে সাইন ইন"
      className="mt-6 space-y-4"
    >
      <div className="relative flex items-center py-2">
        <div className="w-full border-t border-slate-200" />
        <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-slate-400">
          অথবা
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {providers.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleSocialSignIn(id)}
            disabled={pendingProvider !== null}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            <Icon
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 ${
                id === "github" ? "text-slate-900" : ""
              }`}
            />
            <span className="whitespace-nowrap leading-none">
              {pendingProvider === id
                ? `${label} দিয়ে সংযোগ হচ্ছে...`
                : `${label} দিয়ে চালিয়ে যান`}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
