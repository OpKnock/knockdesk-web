import { CopyButton } from "./CopyButton";

export function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="kd-code">
      <pre><code>{code}</code></pre>
      <CopyButton text={code} label={label} />
    </div>
  );
}
