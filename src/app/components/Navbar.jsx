"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

export default function Navbar({ user, onSignOut }) {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/categories",
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

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between border-b border-slate-100">
        {/* BazarDor Logo & Date */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl shadow-md group-hover:bg-emerald-700 transition-colors">
            🛒
          </div>
          <div>
            <h1 className="font-bold text-2xl text-slate-800 leading-tight">
              বাজার দর
            </h1>
            <p className="text-[13px] text-slate-900">{date}</p>
          </div>
        </Link>

        {/* Auth Buttons & Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-slate-700 text-sm font-medium hover:text-emerald-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden relative border border-slate-300">
                  <Image
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <button
                onClick={onSignOut}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                সাইন আউট
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                সাইন ইন
              </Link>
              <Link
                href="/sign-up"
                className="text-xs sm:text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-none py-2.5">
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
                      href={`/products?category=${cat.nameBn || cat.id}`}
                      className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 ${
                        isActive
                          ? "bg-emerald-600 text-white font-semibold shadow-sm"
                          : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                      }`}
                    >
                      <span>{cat.icon || "📦"}</span>
                      <span className="font-bold text-[13px]">
                        {cat.nameBn}
                      </span>
                    </Link>
                  </li>
                );
              })}
        </ul>
      </nav>
    </header>
  );
}
