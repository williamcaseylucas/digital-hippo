import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";
import { User } from "../app/payload-types";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;

  return { ...data, user: user?.id };
};

const yourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;

  if (user?.role === "admin") return true;
  if (!user) return false;

  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 0, // only give user id instead of entire user
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const ownProductFileIdsPre = products.map((prod) => prod.product_files);
  console.log("before cat", ownProductFileIdsPre);
  const ownProductFileIds = ownProductFileIdsPre.flat();
  console.log("after cat", ownProductFileIds);

  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2, // gives user and products since there are relations
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  // Filters out NA values with Boolean filter and .flat() to change [][] to []
  const purchasedProductFileIds = orders
    .map((order) =>
      order.products.map((product) => {
        // product could be String or Product depending on if it can go the depth it wants. We know it is just the id if it doesn't go down a depth, so we throw this error in case
        if (typeof product === "string")
          return req.payload.logger.error(
            "Search depth not sufficient to find purchased file IDs"
          );

        // Giving either array of 'id's' or just an "id" which will be a "Product"
        return typeof product.product_files === "string"
          ? product.product_files
          : product.product_files.id;
      })
    )
    .filter(Boolean)
    .flat();

  return {
    id: {
      in: [...ownProductFileIds, ...purchasedProductFileIds],
    },
  };
};

export const ProductFiles: CollectionConfig = {
  slug: "product_files",
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  hooks: {
    beforeChange: [addUser],
  },
  access: {
    read: yourOwnAndPurchased,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  upload: {
    staticURL: "/product_files",
    staticDir: "product_files",
    mimeTypes: ["image/*", "font/*", "application/postscript"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        condition: () => false,
      },
      hasMany: false,
      required: true,
    },
  ],
};
