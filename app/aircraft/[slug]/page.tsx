import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveAxis } from "@/lib/axis";
import { ResultsView } from "@/components/browse/ResultsView";

/* Parts listed against one aircraft platform. The /aircraft index links here. */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = resolveAxis("platform", slug);
  if (!a) return { title: "Not found" };
  return { title: a.title, description: a.lede };
}

export default async function PlatformResults({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ stock?: string }>;
}) {
  const { slug } = await params;
  const { stock } = await searchParams;
  const axis = resolveAxis("platform", slug);
  if (!axis) notFound();
  return <ResultsView axis={axis} base={`/aircraft/${encodeURIComponent(slug)}`} stock={stock} />;
}
