import Link from "next/link";
import { CiGrid41, CiBoxList } from "react-icons/ci";

export type View = "grid" | "list";

export const toView = (value?: string): View =>
  value === "list" ? "list" : "grid";

export default async function ViewToggle({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; view?: string }>;
}) {
  const { query, view: rawView } = await searchParams;
  const view = toView(rawView);

  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (view === "grid") params.set("view", "list");
  const qs = params.toString();

  return (
    <Link
      href={qs ? `/projects?${qs}` : "/projects"}
      replace
      scroll={false}
      aria-label={
        view === "grid" ? "Switch to list view" : "Switch to grid view"
      }
      className="relative box flex shrink-0 items-center gap-2 p-2"
    >
    <span className={`absolute box rounded-md left-1 inset-y-1 w-[calc(50%-4px)] transition-transform bg-accent/20 ${view === 'grid' ? 'transition-x-0': 'translate-x-full'}`} />
      <span className="relative">
        <CiGrid41 size={24} />
      </span>
      <span className="relative">
        <CiBoxList size={24} />
      </span>
    </Link>
  );
}
