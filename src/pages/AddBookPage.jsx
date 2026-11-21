import BookForm from "../components/BookForm";

export default function AddBookPage({ onAdd }) {
  return (
    <>
      <h1 className="text-2xl font-bold text-center">إضافة كتاب جديد</h1>
      <BookForm onAdd={onAdd} />
    </>
  );
}