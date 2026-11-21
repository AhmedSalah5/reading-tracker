import { useState } from "react";

const STATUS = {
  want: { label: "أريد قراءته", color: "bg-amber-100 text-amber-800" },
  reading: { label: "أقرؤه الآن", color: "bg-blue-100 text-blue-800" },
  done: { label: "انتهيت منه", color: "bg-green-100 text-green-800" },
};

export default function BookCard({ book, onDelete, onLog, onOpen }) {
  const [pages, setPages] = useState("");
  const percent = Math.round((book.currentPage / book.totalPages) * 100);
  const s = STATUS[book.status];
  const remaining = book.totalPages - book.currentPage;

  const handleLog = (e) => {
    e.preventDefault();
    const n = Number(pages);
    if (!n || n < 1) return;
    onLog(book.id, n);
    setPages("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-2">
      <div className="flex justify-between items-start gap-2">
        <button onClick={() => onOpen(book.id)} className="text-start">
          <h3 className="font-bold">{book.title}</h3>
          {book.author && (
            <p className="text-sm text-slate-500">{book.author}</p>
          )}
        </button>
        <span className={`text-xs px-2 py-1 rounded-full ${s.color}`}>
          {s.label}
        </span>
      </div>

      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>
          {book.currentPage} / {book.totalPages} صفحة ({percent}%)
        </span>
        <button
          onClick={() => onDelete(book.id)}
          className="text-red-600 hover:underline"
        >
          حذف
        </button>
      </div>

      {book.status !== "done" && (
        <form onSubmit={handleLog} className="flex gap-2 pt-1">
          <input
            type="number"
            min="1"
            max={remaining}
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="كم صفحة قرأت اليوم؟"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 text-sm font-semibold">
            سجّل
          </button>
        </form>
      )}
    </div>
  );
}