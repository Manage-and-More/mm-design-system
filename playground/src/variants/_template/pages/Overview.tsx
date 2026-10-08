import { Specimen } from '@/core/docs/Specimen';

export default function Overview() {
  return (
    <Specimen title="Hello, __NAME__" description="Replace this page. Foundations pages are generated from tokens.json.">
      <div className="grid gap-4">
        <p className="text-3xl font-extrabold">Build and scale.</p>
        <p className="text-fg-muted">Utilities map to this variant's tokens through @theme inline in styles.css.</p>
        <button type="button" className="w-fit rounded-full bg-accent px-5 py-2 font-bold text-black">
          Action
        </button>
      </div>
    </Specimen>
  );
}
