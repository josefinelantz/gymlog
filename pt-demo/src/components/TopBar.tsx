import type { ViewMode } from "../types";

type Props = {
  mode: ViewMode;
  onChangeMode: (mode: ViewMode) => void;
  brandName?: string;
  tagline?: string;
};

export function TopBar({
  mode,
  onChangeMode,
  brandName = "DemoFit",
  tagline = "PT demo (design-first)",
}: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-zinc-900 text-white">
            <span className="text-sm font-semibold">DF</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-900">{brandName}</div>
            <div className="text-xs text-zinc-500">{tagline}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-1">
          <ToggleButton active={mode === "trainer"} onClick={() => onChangeMode("trainer")}>
            PT view
          </ToggleButton>
          <ToggleButton active={mode === "client"} onClick={() => onChangeMode("client")}>
            Client view
          </ToggleButton>
        </div>
      </div>
    </header>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-zinc-900 text-white shadow-sm"
          : "bg-white text-zinc-700 hover:bg-zinc-100",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}