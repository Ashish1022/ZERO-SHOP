import Link from "next/link";

import Grid from "./grid";
import { GridTileImage } from "./tile";

import { Product } from "@/modules/products/server/procedure";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.slug} className="animate-fadeIn">
          <Link
            className="group relative inline-block h-full w-full overflow-hidden rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all duration-300"
            href={`/product/${product.slug}`}
            prefetch={true}
          >
            <div className="relative h-full w-full overflow-hidden">
              <GridTileImage
                alt={product.name}
                label={{
                  title: product.name,
                  amount: product.price,
                  currencyCode: "INR",
                }}
                src={
                  product.images[0].isPrimary
                    ? product.images[0].url
                    : product.images[1].url
                }
                fill
                sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </div>
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}