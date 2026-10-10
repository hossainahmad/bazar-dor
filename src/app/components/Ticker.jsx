// src/app/components/Ticker.jsx
"use client";

import { useEffect, useState } from "react";

export default function Ticker() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickerProducts() {
      try {
        const res = await fetch(
          "https://api.abcz.workers.dev/api/bazardor/products",
        );
        const data = await res.json();
        const productsList = Array.isArray(data) ? data : data.products || [];
        setItems(productsList);
      } catch (err) {
        console.error("Failed to fetch ticker products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTickerProducts();
  }, []);

  if (loading || items.length === 0) {
    return (
      <div className="bg-slate-100/80 border-b border-slate-200 py-2.5 text-center text-xl text-slate-400">
        লাইভ দর আপডেট লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="bg-slate-100/80 border-b border-slate-200 overflow-hidden py-2 text-[14px] select-none">
      <div className="flex w-max animate-marquee space-x-10 hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, idx) => {
          const name = item.nameBn || item.title || item.product_name || "পণ্য";
          const price =
            item.today ?? item.today_price ?? item.current_price ?? 0;
          const unit = item.unit || item.unit_type || "কেজি";
          const rawChange = item.changePercentage ?? item.change.pct;
          item.price_change ?? item.percentage ?? 0;
          const changeVal = parseFloat(rawChange) || 0;

          const changeType =
            item.changeType ||
            (changeVal > 0 ? "up" : changeVal < 0 ? "down" : "flat");
          const isUp = changeType === "up";
          const isDown = changeType === "down";

          return (
            <div
              key={`${item.id || idx}-${idx}`}
              className="flex items-center gap-2 text-slate-700 font-medium shrink-0"
            >
              <span className="text-sm">
                {item.categoryIcon || item.emoji || "🛒"}
              </span>
              <span>{name}</span>
              <span className="text-slate-900 font-bold">
                {price} টাকা/{unit}
              </span>
              <span
                className={`font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                  isUp
                    ? "text-rose-600 bg-rose-50"
                    : isDown
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-slate-500 bg-slate-200/50"
                }`}
              >
                <span>{isUp ? "▲" : isDown ? "▼" : "—"}</span>
                <span>{Math.abs(changeVal)}%</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
