import type { Mode } from "../types";

export function TopBar({
  title,
  subtitle,
  mode,
  onToggleMode,
  leftAction,
  rightAction,
}: {
  title: string;
  subtitle?: string;
  mode: Mode;
  onToggleMode: () => void;
  leftAction?: { label: string; onClick: () => void };
  rightAction?: { label: string; onClick: () => void };
}) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-zinc-900 truncate">{title}</div>
          {subtitle ? <div className="text-xs text-zinc-500 truncate">{subtitle}</div> : null}
        </div>

        <div className="flex items-center gap-2">
          {leftAction ? (
            <button
              type="button"
              onClick={leftAction.onClick}
              className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-200"
            >
              {leftAction.label}
            </button>
          ) : null}

          {rightAction ? (
            <button
              type="button"
              onClick={rightAction.onClick}
              className="rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              {rightAction.label}
            </button>
          ) : null}

          <button
            type="button"
            onClick={onToggleMode}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
            title="Toggle PT / Client"
          >
            {mode === "pt" ? "Client mode" : "PT mode"}
          </button>
        </div>
      </div>
    </header>
  );
}