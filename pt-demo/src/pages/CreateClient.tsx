import { useMemo, useState } from "react";

export function CreateClient({
  onCreate,
}: {
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const canSave = useMemo(() => name.trim().length >= 2, [name]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-semibold text-zinc-900">New client</div>

        <label className="mt-4 block">
          <div className="text-xs font-medium text-zinc-600">Name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maria"
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
          />
        </label>

        <button
          type="button"
          disabled={!canSave}
          onClick={() => onCreate(name.trim())}
          className={[
            "mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
            canSave
              ? "bg-zinc-900 text-white hover:bg-zinc-800"
              : "bg-zinc-100 text-zinc-400 cursor-not-allowed",
          ].join(" ")}
        >
          Create
        </button>
      </div>
    </div>
  );
}