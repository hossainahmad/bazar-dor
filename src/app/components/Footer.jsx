export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="font-semibold text-slate-700">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
        <p className="text-slate-500 italic leading-relaxed sm:max-w-[52%] sm:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
