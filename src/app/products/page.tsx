import { PRODUCT_CATEGORIES } from "@/config";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import ProductReel from "../components/ProductReel";

type Param = string | string[] | undefined;

interface ProductPageProps {
  searchParams: { [key: string]: Param };
}

// Ensure we only get type string and not string[]
const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};

const ProductsPage = ({ searchParams }: ProductPageProps) => {
  // Reference PRODUCT_CATEGORIES to see where these values are coming from
  const sort = parse(searchParams.sort);
  const category = parse(searchParams.category);

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label;

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={label ?? "Browse high-quality assets"}
        query={{
          category,
          limit: 40,
          sort: sort === "desc" || sort === "asc" ? sort : undefined,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default ProductsPage;
