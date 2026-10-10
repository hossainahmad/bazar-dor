"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [name, setName] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in?callbackUrl=%2Fprofile");
    }
  }, [isPending, router, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    const updatedName = (name ?? user?.name ?? "").trim();
    if (!updatedName) {
      toast.error("নাম লিখুন।");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.updateUser({ name: updatedName });
      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা যায়নি।");
        return;
      }

      setName(updatedName);
      toast.success("প্রোফাইলের নাম আপডেট হয়েছে।");
      router.refresh();
    } catch {
      toast.error("সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPending || !user) {
    return (
      <main className="min-h-[60vh] bg-[#f4f6f3] px-4 py-10">
        <div
          role="status"
          aria-label="প্রোফাইল লোড হচ্ছে"
          className="mx-auto h-64 max-w-xl animate-pulse rounded-2xl border border-slate-100 bg-white"
        />
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] bg-[#f4f6f3] px-4 py-10 sm:py-14">
      <section className="mx-auto w-full max-w-xl space-y-6">
        <div>
          <Link
            href="/"
            className="text-xs font-medium text-slate-500 hover:text-emerald-700"
          >
            ← হোম পেজ
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-800">
            আমার প্রোফাইল
          </h1>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="space-y-2">
            <label
              htmlFor="profile-name"
              className="block text-sm font-semibold text-slate-700"
            >
              নাম
            </label>
            <input
              id="profile-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              value={name ?? user.name ?? ""}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
          </button>
        </form>
      </section>
    </main>
  );
}
