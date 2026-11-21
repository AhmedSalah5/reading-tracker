import { useState } from "react";

export default function BookForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [status, setStatus] = useState("want");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !totalPages) return;

    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      author: author.trim(),
      totalPages: Number(totalPages),
      currentPage: status === "done" ? Number(totalPages) : 0,
      status,
      rating: 0,
      quotes: [],
      createdAt: new Date().toISOString(),
    });

    setTitle("");
    setAuthor("");
    setTotalPages("");
    setStatus("want");
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-4 space-y-3"
    >
      <h2 className="font-bold text-lg">إضافة كتاب</h2>
      <input
        className={inputClass}
        placeholder="عنوان الكتاب"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="المؤلف"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        className={inputClass}
        type="number"
        min="1"
        placeholder="عدد الصفحات"
        value={totalPages}
        onChange={(e) => setTotalPages(e.target.value)}
      />
      <select
        className={inputClass}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="want">أريد قراءته</option>
        <option value="reading">أقرؤه الآن</option>
        <option value="done">انتهيت منه</option>
      </select>
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 font-semibold">
        إضافة
      </button>
    </form>
  );
}