"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { io } from "next/cache";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Ticker from "./Ticker";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  use(io());
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://api.abcz.workers.dev/api/bazardor/categories",
        );
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি।");
        return;
      }
      toast.success("সাইন আউট সফল হয়েছে।");
      router.refresh();
    } catch {
      toast.error("সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 min-h-16 py-2 sm:h-16 sm:py-0 flex items-center justify-between gap-2 border-b border-slate-100">
        {/* BazarDor Logo & Date */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 sm:gap-3 group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl shadow-md group-hover:bg-emerald-700 transition-colors shrink-0">
            🛒
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-xl sm:text-2xl text-slate-800 leading-tight whitespace-nowrap">
              বাজার দর
            </h1>
            <p className="max-w-[132px] text-[11px] leading-tight text-slate-900 sm:max-w-none sm:text-[13px]">
              {date}
            </p>
          </div>
        </Link>

        {/* Auth Buttons & Profile */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          {authLoading ? (
            <div className="w-20 sm:w-24 h-8 bg-slate-100 animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="text-[11px] sm:text-sm font-medium text-slate-700 hover:text-emerald-700"
              >
                <span className="hidden sm:inline">
                  {user.name || user.email}
                </span>
                <span className="sm:hidden">প্রোফাইল</span>
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-[11px] sm:text-xs px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="text-[11px] sm:text-sm font-medium text-slate-700 hover:text-emerald-600 px-2 sm:px-3 py-1.5 rounded-lg transition-colors"
              >
                সাইন ইন
              </Link>
              <Link
                href="/sign-up"
                className="text-[11px] sm:text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-none touch-pan-x py-2.5">
        <ul className="flex items-center gap-2 text-xs font-medium whitespace-nowrap min-w-max">
          {/* Default All Link */}
          <li>
            <Link
              href="/products"
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                pathname === "/products" && currentCategory === "all"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-slate-600 bg-slate-100 hover:bg-slate-200"
              }`}
            >
              <span>🏷️</span>
              <span>সব পণ্য</span>
            </Link>
          </li>
          <li>
            <Link
              href="/categories"
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                pathname === "/categories"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-slate-600 bg-slate-100 hover:bg-slate-200"
              }`}
            >
              <span>📂</span>
              <span>সকল ক্যাটাগরি</span>
            </Link>
          </li>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <li
                  key={i}
                  className="w-20 h-7 bg-slate-100 animate-pulse rounded-full"
                />
              ))
            : categories.map((cat) => {
                const isActive =
                  currentCategory === cat.nameBn ||
                  currentCategory === String(cat.id);
                return (
                  <li key={cat.id || cat.nameBn}>
                    <Link
                      href={`/products?category=${cat.category || cat.id}`}
                      className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                        isActive
                          ? "bg-emerald-600 text-white font-semibold shadow-sm"
                          : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                      }`}
                    >
                      <span>{cat.icon || "📦"}</span>
                      <span className="font-bold text-[15px]">
                        {cat.nameBn}
                      </span>
                    </Link>
                  </li>
                );
              })}
        </ul>
      </nav>
      <Ticker></Ticker>
    </header>
  );
}
