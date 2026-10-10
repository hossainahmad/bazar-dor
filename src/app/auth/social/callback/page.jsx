"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const providerNames = {
  google: "Google",
  github: "GitHub",
};

function SocialCallbackResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const provider =
    providerNames[searchParams.get("provider")] || "সামাজিক অ্যাকাউন্ট";
  const requestedNext = searchParams.get("next");
  const nextURL =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  useEffect(() => {
    if (status === "success") {
      toast.success(`${provider} দিয়ে সাইন ইন সফল হয়েছে।`, {
        id: "social-auth-result",
      });
    } else if (status === "signup") {
      toast.success(`${provider} দিয়ে অ্যাকাউন্ট তৈরি হয়েছে।`, {
        id: "social-auth-result",
      });
    } else if (status === "error") {
      toast.error(
        `${provider} দিয়ে সাইন-ইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।`,
        {
          id: "social-auth-result",
        },
      );
    }

    router.replace(nextURL);
    router.refresh();
  }, [nextURL, provider, router, status]);

  return (
    <main className="min-h-[50vh] bg-[#f4f6f3] px-4 py-12 flex items-center justify-center">
      <p role="status" className="text-sm font-medium text-slate-500">
        সাইন-ইন সম্পন্ন হচ্ছে...
      </p>
    </main>
  );
}

export default function SocialAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[50vh] bg-[#f4f6f3] px-4 py-12 flex items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            সাইন-ইন সম্পন্ন হচ্ছে...
          </p>
        </main>
      }
    >
      <SocialCallbackResult />
    </Suspense>
  );
}
