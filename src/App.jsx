import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import { todayStr } from "./utils/date";
import BottomNav from "./components/BottomNav";
import LibraryPage from "./pages/LibraryPage";
import AddBookPage from "./pages/AddBookPage";
import StatsPage from "./pages/StatsPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import useInstallPrompt from "./hooks/useInstallPrompt";

export default function App() {
  const [books, setBooks] = useLocalStorage("books", []);
  const [logs, setLogs] = useLocalStorage("logs", []);
  const [tab, setTab] = useState("library");
  const { canInstall, install } = useInstallPrompt();
  const [selectedId, setSelectedId] = useState(null);

  const selectedBook = books.find((b) => b.id === selectedId);

  const openBook = (id) => {
    setSelectedId(id);
    setTab("details");
  };

  const addBook = (book) => {
    setBooks([book, ...books]);
    setTab("library");
  };

  const updateBook = (id, changes) =>
    setBooks(books.map((b) => (b.id === id ? { ...b, ...changes } : b)));

  const deleteBook = (id) => {
    setBooks(books.filter((b) => b.id !== id));
    setLogs(logs.filter((l) => l.bookId !== id));
  };

  const logPages = (bookId, pages) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    const added = Math.min(pages, book.totalPages - book.currentPage);
    if (added <= 0) return;

    const currentPage = book.currentPage + added;
    const isDone = currentPage >= book.totalPages;
    const now = new Date().toISOString();

    updateBook(bookId, {
      currentPage,
      status: isDone ? "done" : "reading",
      startedAt: book.startedAt ?? now,
      finishedAt: isDone ? now : book.finishedAt,
    });

    setLogs([
      { id: crypto.randomUUID(), bookId, pages: added, date: todayStr() },
      ...logs,
    ]);
  };

  const [yearGoal, setYearGoal] = useLocalStorage("yearGoal", 12);

  // تصحيح مباشر للصفحة الحالية (بدون تسجيل في سجل اليوم)
  const setPage = (id, page) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;

    const p = Math.max(0, Math.min(page, book.totalPages));
    const isDone = p >= book.totalPages;
    const now = new Date().toISOString();

    updateBook(id, {
      currentPage: p,
      status: isDone ? "done" : p > 0 ? "reading" : "want",
      startedAt: p > 0 ? book.startedAt ?? now : book.startedAt,
      finishedAt: isDone ? book.finishedAt ?? now : undefined,
    });
  };

  const todayPages = logs
    .filter((l) => l.date === todayStr())
    .reduce((sum, l) => sum + l.pages, 0);

  return (
    <div className="min-h-screen bg-slate-100 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <div className="max-w-xl mx-auto p-4 space-y-4">
        {tab === "library" && (
          <LibraryPage
            books={books}
            todayPages={todayPages}
            onDelete={deleteBook}
            onLog={logPages}
            onOpen={openBook}
            canInstall={canInstall}
            onInstall={install}
          />
        )}
        {tab === "details" && selectedBook && (
          <BookDetailsPage
            key={selectedBook.id}
            book={selectedBook}
            onBack={() => setTab("library")}
            onUpdate={updateBook}
            onSetPage={setPage}
          />
        )}
        {tab === "add" && <AddBookPage onAdd={addBook} />}
        {tab === "stats" && <StatsPage books={books} logs={logs} goal={yearGoal} onGoalChange={setYearGoal} />}
      </div>

      <BottomNav
        active={tab === "details" ? "library" : tab}
        onChange={setTab}
      />
    </div>
  );
}