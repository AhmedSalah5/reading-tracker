import { useState } from "react";
import { ChevronRight, Trash2 } from "lucide-react";
import StarRating from "../components/StarRating";
import { todayStr } from "../utils/date";

const STATUS = {
  want: "أريد قراءته",
  reading: "أقرؤه الآن",
  done: "انتهيت منه",
};

const fmt = (iso) => new Date(iso).toLocaleDateString("ar-EG");

export default function BookDetailsPage({ book, onBack, onUpdate, onSetPage }) {
  const [pageInput, setPageInput] = useState(String(book.currentPage));
  const [quoteText, setQuoteText] = useState("");
  const [quotePage, setQuotePage] = useState("");

  const quotes = book.quotes ?? [];
  const percent = Math.round((book.currentPage / book.totalPages) * 100);

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const savePage = (e) => {
    e.preventDefault();
    const n = Number(pageInput);
    if (Number.isNaN(n)) return;
    onSetPage(book.id, n);
  };

  const addQuote = (e) => {
    e.preventDefault();
    if (!quoteText.trim()) return;
    const quote = {
      id: crypto.randomUUID(),
      text: quoteText.trim(),
      page: quotePage ? Number(quotePage) : null,
      date: todayStr(),
    };
    onUpdate(book.id, { quotes: [quote, ...quotes] });
    setQuoteText("");
    setQuotePage("");
  };

  const deleteQuote = (id) =>
    onUpdate(book.id, { quotes: quotes.filter((q) => q.id !== id) });

  return (
    <>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-indigo-600 font-semibold"
      >
        <ChevronRight size={20} />
        رجوع
      </button>

      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <div>
          <h1 className="text-xl font-bold">{book.title}</h1>
          {book.author && <p className="text-slate-500">{book.author}</p>}
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="text-sm text-slate-600 space-y-1">
          <p>
            الحالة: <b>{STATUS[book.status]}</b> ({percent}%)
          </p>
          {book.startedAt && <p>بدأت القراءة: {fmt(book.startedAt)}</p>}
          {book.finishedAt && <p>انتهيت منه: {fmt(book.finishedAt)}</p>}
        </div>
      </div>

      <form
        onSubmit={savePage}
        className="bg-white rounded-xl shadow p-4 space-y-2"
      >
        <h2 className="font-bold">تعديل الصفحة الحالية</h2>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            max={book.totalPages}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            className={inputClass}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 text-sm font-semibold">
            حفظ
          </button>
        </div>
        <p className="text-xs text-slate-500">
          هذا تصحيح مباشر للصفحة، ولا يُحسب ضمن صفحات اليوم.
        </p>
      </form>

      <div className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-bold">تقييمي</h2>
        <StarRating
          value={book.rating ?? 0}
          onChange={(r) => onUpdate(book.id, { rating: r })}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="font-bold">الاقتباسات ({quotes.length})</h2>

        <form onSubmit={addQuote} className="space-y-2">
          <textarea
            rows="3"
            placeholder="اكتب الاقتباس هنا..."
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            className={inputClass}
          />
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={book.totalPages}
              placeholder="رقم الصفحة (اختياري)"
              value={quotePage}
              onChange={(e) => setQuotePage(e.target.value)}
              className={inputClass}
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 text-sm font-semibold whitespace-nowrap">
              إضافة
            </button>
          </div>
        </form>

        {quotes.length === 0 ? (
          <p className="text-sm text-slate-500">لا توجد اقتباسات بعد.</p>
        ) : (
          <ul className="space-y-2">
            {quotes.map((q) => (
              <li
                key={q.id}
                className="border-s-4 border-indigo-400 bg-slate-50 rounded-lg p-3"
              >
                <p className="leading-relaxed">“{q.text}”</p>
                <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                  <span>
                    {q.page ? `صفحة ${q.page} · ` : ""}
                    {q.date}
                  </span>
                  <button
                    onClick={() => deleteQuote(q.id)}
                    aria-label="حذف الاقتباس"
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}