"use client";

import { type ReactNode } from "react";

type Item = {
  id: string;
  content: ReactNode;
};

type Props = {
  items: Item[];
  className?: string;
};

export default function AnimatedList({ items, className = "" }: Props) {
  return (
    <ul className={`animated-list ${className}`}>
      {items.map((item, i) => (
        <li
          key={item.id}
          className="animated-list-item"
          style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
        >
          {item.content}
        </li>
      ))}
    </ul>
  );
}
