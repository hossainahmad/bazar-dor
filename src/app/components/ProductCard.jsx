import Link from "next/link";

export default function ProductCard({ product }) {
  if (!product) return null;

  const name = product.nameBn || product.name || "পণ্য";
  const price = product.today ?? product.price ?? 0;

  const unitMap = {
    kg: "প্রতি কেজি",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
  };
  const unitText = unitMap[product.unit] || `প্রতি ${product.unit || "কেজি"}`;

  const icon = product.image || product.categoryIcon || "🛒";

  const dir = product.change?.dir || product.changeType || "flat";
  const pct = product.change?.pct ?? product.changePercentage ?? 0;

  const isUp = dir === "up";
  const isDown = dir === "down";

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-base leading-snug">
            {name}
          </h3>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            {unitText}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-1 flex items-end justify-between">
        <div>
          <p className="text-[11px] text-slate-400 font-medium">আজকের দাম</p>
          <p className="text-lg font-extrabold text-slate-900 mt-0.5">
            {price} <span className="text-sm font-semibold">টাকা</span>
          </p>
        </div>

        <div
          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
            isUp
              ? "bg-rose-50 text-rose-600"
              : isDown
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-500"
          }`}
        >
          <span className="text-[10px]">{isUp ? "▲" : isDown ? "▼" : "—"}</span>
          <span>{pct}%</span>
        </div>
      </div>

      <Link
        href={`/product/${product.id}`}
        className="absolute inset-0"
        aria-label={name}
      />
    </div>
  );
}
