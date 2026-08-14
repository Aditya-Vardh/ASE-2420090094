"use client";

const MIN_CHARS = 15;

const EXAMPLES = [
  {
    label: "Hospital Management",
    text: "A hospital management system where Doctors treat Patients, Patients book Appointments, and Bills are issued to Patients.",
  },
  {
    label: "E-commerce Platform",
    text: "An e-commerce platform with Customers, Products, Orders, and ShoppingCarts. Customers place Orders containing multiple Products.",
  },
  {
    label: "Library System",
    text: "A library system where Members borrow Books, Librarians manage the catalog, and each Loan tracks due dates.",
  },
  {
    label: "Ride Sharing App",
    text: "A ride sharing app where Riders request Rides, Drivers accept them, and Payments are processed per Trip.",
  },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export { MIN_CHARS };

export default function IdeaInput({ value, onChange }: Props) {
  const charCount = value.length;
  const isTooShort = charCount > 0 && charCount < MIN_CHARS;

  return (
    <div className="animate-fade-in-up animation-delay-200 rounded-2xl border border-white/10 bg-surface-elevated p-5 shadow-lg shadow-black/20 transition-all duration-200 focus-within:border-accent/40 focus-within:shadow-[0_0_0_3px_var(--accent-glow)] sm:p-6">
      <p className="mb-3 text-sm font-medium text-foreground">
        Describe your software idea
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={() => onChange(example.text)}
            className="rounded-full border border-white/10 bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 active:scale-95"
          >
            {example.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your system — entities, relationships, and key features…"
          rows={8}
          className="w-full resize-none rounded-xl border border-white/8 bg-background/60 px-4 py-3.5 text-sm leading-relaxed text-foreground outline-none transition-all duration-200 placeholder:text-subtle focus:border-accent/30 focus:bg-background/80 sm:text-base"
        />
        <span className="absolute bottom-3 right-3 text-xs tabular-nums text-subtle">
          {charCount}
        </span>
      </div>

      {isTooShort && (
        <p className="mt-2 text-xs text-muted">
          Add a bit more detail for better results.
        </p>
      )}
    </div>
  );
}
