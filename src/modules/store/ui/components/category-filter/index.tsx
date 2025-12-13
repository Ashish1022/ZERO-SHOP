import { FilterItem } from "./item";
import FilterItemDropdown from "./dropdown";
import { SortFilterItem } from "@/constants";

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { 
  label?: string; 
  path: string; 
  title: string;
  subcategories?: PathFilterItem[];
};

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <>
      {list.map((item: ListItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
    </>
  );
}

export default function FilterList({
  list,
  title,
}: {
  list: ListItem[];
  title?: string;
}) {
  return (
    <nav className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
      {title ? (
        <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
          {title}
        </h3>
      ) : null}
      
      <ul className="hidden md:block space-y-1">
        <FilterItemList list={list} />
      </ul>
      
      <div className="md:hidden">
        <FilterItemDropdown list={list} />
      </div>
    </nav>
  );
}