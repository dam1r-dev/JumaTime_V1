import { SermonForm } from "../sermon-form";
import { createSermon } from "../actions";

export default function NewSermonPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Новая проповедь</h1>
      <div className="mt-6 max-w-3xl rounded-2xl border border-border bg-card p-6">
        <SermonForm action={createSermon} />
      </div>
    </div>
  );
}
