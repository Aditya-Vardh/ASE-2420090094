"use client";

import { Loader2, Wand2 } from "lucide-react";

type Props = {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  label?: string;
};

export default function GenerateButton({
  loading,
  disabled = false,
  onClick,
  label = "Generate Architecture",
}: Props) {
  const isDisabled = loading || disabled;

  return (
    <div className="animate-fade-in-up animation-delay-300 mt-6 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        className="inline-flex min-w-[200px] items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:active:scale-100 sm:text-base"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Generating…
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" aria-hidden />
            {label}
          </>
        )}
      </button>
    </div>
  );
}
