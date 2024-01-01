"use client";

import Link from "next/link";
import { trpc } from "../../trpc/client";
import { TQueryValidator } from "../../lib/validators/query-validators";
import { Product } from "../../payload-types";
import ProductListing from "./ProductListing";

interface ProductReelProps {
  title: string;
  subtitle: string;
  href?: string;
  query: TQueryValidator;
}

const FALLBACK_LIMIT = 4;

const ProductReel = (props: ProductReelProps) => {
  const { title, subtitle, href, query } = props;

  const { data: queryResults, isLoading } =
    trpc.getInfiniteProducts.useInfiniteQuery(
      {
        limit: query.limit ?? FALLBACK_LIMIT,
        query,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );

  // Same as .map().flatten()
  const products = queryResults?.pages.flatMap((page) => page.items);

  // queryResults?.pages.forEach(({ items }) => {
  //   console.log("this is an item", items[0].id);
  //   console.log("this is an item", items[0].name);
  //   console.log("this is an item", items[0].description);
  // });
  // console.log(queryResults?.pages[0].items[0].id);

  // console.log("products.name", products?.);

  // Map of Products with 'categories' that should be matched to 'values' from PRODUCTCATEGORIES
  let map: (Product | null)[] = [];

  if (products && products.length) {
    map = products;
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  }

  console.log(queryResults);
  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}

          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {/* load 4 images */}
        {href ? (
          <Link
            href={href}
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
          >
            Shop the collection <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {map.map((product, i) => (
              <ProductListing
                product={product}
                index={i}
                key={`product-${i}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReel;
