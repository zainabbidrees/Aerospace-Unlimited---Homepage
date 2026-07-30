import { highlightSegments } from "@/lib/search";

/* The prototype built <mark> into an HTML string. Rendering segments as nodes
   keeps the same visual result without handing user-typed text back to the
   DOM as markup. */
export function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlightSegments(text, query).map((s, i) =>
        s.mark ? <mark key={i}>{s.text}</mark> : <span key={i}>{s.text}</span>
      )}
    </>
  );
}
