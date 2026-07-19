import { ContentForm } from "../content-form";
import { createContentBlock } from "../actions";

export default function NewContentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Новый материал</h1>
      <div className="mt-6 max-w-3xl rounded-2xl border border-border bg-card p-6">
        <ContentForm action={createContentBlock} />
      </div>
    </div>
  );
}
