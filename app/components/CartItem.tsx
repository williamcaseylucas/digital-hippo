import { ImageIcon, X } from "lucide-react";
import { Product } from "../../payload-types";
import Image from "next/image";
import { PRODUCT_CATEGORIES } from "../../config";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

const CartItem = ({ product }: { product: Product }) => {
  const { image } = product.images[0];

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  const { removeItem } = useCart();

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          {/* image */}
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            {typeof image !== "string" && image.url ? (
              <Image
                src={image.url}
                alt={product.name}
                fill
                className="absolute object-cover"
              />
            ) : (
              // Only if we only had an id which shouldn't happen due to our depth. This is a fallback
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
            )}
          </div>

          {/* Product description: name, label, remove button */}
          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product.name}
            </span>

            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
              {label}
            </span>

            <div className="mt-4 text-xs text-muted-foreground">
              <button
                onClick={() => removeItem(product.id)}
                className="flex items-center gap-0.5"
              >
                <X className="w-3 h-3" />
                Remove
              </button>
            </div>
          </div>
        </div>
        {/* Price - pushes to the left */}
        <div className="flex flex-col space-y-1 font-medium">
          <div className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
