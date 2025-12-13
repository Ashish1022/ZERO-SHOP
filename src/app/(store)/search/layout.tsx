import ChildrenWrapper from "./children-wrapper";
import { Categories } from "@/modules/store/ui/components/search/category-list";

export default async function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 md:px-6">
      <div className="flex flex-col gap-8 pb-8 md:flex-row">
        <aside className="w-full flex-none md:w-64 lg:w-72">
          <div className="sticky top-4 space-y-6">
            <Categories />
          </div>
        </aside>
        
        <main className="min-h-screen flex-1">
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </main>
      </div>
    </div>
  );
}