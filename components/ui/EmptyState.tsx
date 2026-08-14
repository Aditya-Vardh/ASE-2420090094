import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="empty-state-premium">
      <div className="empty-state-icon-wrap">
        <Icon className="h-7 w-7 text-cyan-400/70" aria-hidden />
      </div>
      <h3>{title}</h3>
      <p className="mb-6">{description}</p>
      {action}
    </div>
  );
}
