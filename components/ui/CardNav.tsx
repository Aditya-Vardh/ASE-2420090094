"use client";

type CardNavItem = {
  id: string;
  label: string;
  description?: string;
};

type Props = {
  items: CardNavItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
};

export default function CardNav({ items, activeId, onChange, className = "" }: Props) {
  return (
    <nav className={`card-nav ${className}`} role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={activeId === item.id}
          onClick={() => onChange(item.id)}
          className={`card-nav-item ${activeId === item.id ? "card-nav-active" : ""}`}
        >
          <span className="card-nav-label">{item.label}</span>
          {item.description && (
            <span className="card-nav-desc">{item.description}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
