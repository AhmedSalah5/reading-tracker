import { Star } from "lucide-react";

export default function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} نجوم`}
          onClick={() => onChange(n === value ? 0 : n)}
        >
          <Star
            size={32}
            className={n <= value ? "text-amber-400" : "text-slate-300"}
            fill={n <= value ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}