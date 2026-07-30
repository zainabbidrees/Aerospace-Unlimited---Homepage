"use client";

import { useRef, useState } from "react";
import { SearchField } from "@/components/SearchField";

const EXAMPLES = ["MS21042L3", "5310-00-877-5797", "99193", "fuel pump"];

/* The hero field is the same component as the header field, so the two can
   never drift apart in behaviour or in what they accept.

   Example chips fill the field rather than navigating. The buyer watches the
   detection line fire, which teaches what the field accepts far faster than
   a caption listing six identifier types would. */
export function HeroSearch() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="hero-search">
        <SearchField
          id="hero-search"
          value={query}
          onValueChange={setQuery}
          inputRef={inputRef}
        />
      </div>

      <div className="chip-row" style={{ marginTop: "var(--au-s-4)" }}>
        {EXAMPLES.map((example) => (
          <button
            className="chip"
            type="button"
            key={example}
            onClick={() => {
              setQuery(example);
              inputRef.current?.focus();
            }}
          >
            {example}
          </button>
        ))}
      </div>
    </>
  );
}
