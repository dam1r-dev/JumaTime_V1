import { KhutbahForm } from "../khutbah-form";
import { createKhutbah } from "../actions";

export default function NewKhutbahPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Новая хутба</h1>
      <div className="mt-6 max-w-3xl rounded-2xl border border-border bg-card p-6">
        <KhutbahForm action={createKhutbah} />
      </div>
    </div>
  );
}
