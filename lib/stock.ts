import type { Stock } from "./data";

/* Stock semantics are a colour contract as well as a label — see
   design.md → Stock-status semantics. The `data-stock` attribute on
   `.stock` is what ux.css keys the colour off, so the two must stay
   in step. */
export const STOCK_LABEL: Record<Stock, string> = {
  in: "In stock",
  limited: "Limited stock",
  quote: "Quote only",
};
