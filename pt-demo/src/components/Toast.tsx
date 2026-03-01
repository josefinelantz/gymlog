import { useEffect } from "react";

export function Toast({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(onClose, 1500);
    return () => window.clearTimeout(t);
  }, [open, onClose]);

  return (
    <div
      className={[
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm transition",
        open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
      ].join(" ")}
    >
      <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-lg">
        <div className="text-sm font-semibold text-zinc-900">{message}</div>
      </div>
    </div>
  );
}