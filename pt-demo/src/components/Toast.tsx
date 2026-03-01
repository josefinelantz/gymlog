import { useEffect } from "react";

type Props = {
  message: string;
  open: boolean;
  onClose: () => void;
  durationMs?: number;
};

export function Toast({ message, open, onClose, durationMs = 1800 }: Props) {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(t);
  }, [open, onClose, durationMs]);

  return (
    <div
      className={[
        "pointer-events-none fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition",
        open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div className="pointer-events-auto rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-zinc-900">{message}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}