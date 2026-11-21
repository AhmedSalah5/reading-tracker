import BookCard from "../components/BookCard";
import { Download } from "lucide-react";

export default function LibraryPage({ books, todayPages, onDelete, onLog, onOpen, canInstall, onInstall }) {
  return (
    <>
      <h1 className="text-2xl font-bold text-center">📚 مكتبتي</h1>

      {canInstall && (
        <button
          onClick={onInstall}
          className="w-full flex items-center justify-center gap-2 bg-white border border-indigo-200 text-indigo-600 rounded-xl py-2 font-semibold"
        >
          <Download size={18} />
          ثبّت التطبيق على هاتفك
        </button>
      )}

      <div className="bg-indigo-600 text-white rounded-xl p-4 text-center">
        <p className="text-sm opacity-80">قرأت اليوم</p>
        <p className="text-3xl font-bold">{todayPages} صفحة</p>
      </div>

      <div className="space-y-3">
        {books.length === 0 ? (
          <p className="text-center text-slate-500">
            لا توجد كتب بعد، اضغط على زر + لإضافة أول كتاب
          </p>
        ) : (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={onDelete}
              onLog={onLog}
              onOpen={onOpen}
            />
          ))
        )}
      </div>
    </>
  );
}