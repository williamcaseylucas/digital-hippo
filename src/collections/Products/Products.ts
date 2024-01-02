import {
  BeforeChangeHook,
  AfterChangeHook,
} from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from "../../config";
import { Access, CollectionConfig } from "payload/types";
import { Product, User } from "../../payload-types";
import { stripe } from "../../lib/stripe";

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;

  return {
    ...data,
    user: user.id,
  };
};

// Will update User with all the products we currently own via id's
const syncUser: AfterChangeHook<Product> = async ({ req, doc }) => {
  const fullUser = await req.payload.findByID({
    collection: "users",
    id: req.user.id,
  });

  if (fullUser && typeof fullUser === "object") {
    const { products } = fullUser; // extra product array

    // Either extracts id from Product object or assumes the string is an id itself
    const allIds = [
      ...(products?.map((prod) =>
        typeof prod === "object" ? prod.id : prod
      ) || []),
    ];

    // remove all duplicate ids
    const createdProductIds = allIds.filter(
      (id, index) => allIds.indexOf(id) === index
    );

    // updates the current products model with our created ids
    const dataToUpdate = [...createdProductIds, doc.id];
    await req.payload.update({
      collection: "users",
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    });
  }
};

const isAdminOrHasAccess: Access = ({ req: { user: _user } }) => {
  const user = _user as User | undefined;
  if (!user) return false;

  if (user.role === "admin") return true;

  // skip over non-products (not sure why this would happen)
  // return list of products
  const userProductIDs = (user.products || []).reduce<Array<string>>(
    (acc, product) => {
      if (!product) return acc;

      typeof product === "string" ? acc.push(product) : acc.push(product.id);

      return acc;
    },
    []
  );

  // return products only if they are contained in your products you should have access to
  return {
    id: {
      in: userProductIDs,
    },
  };
};

// media and product_files are two more tables being referenced
export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    // access your own stuff only
    read: isAdminOrHasAccess,
    update: isAdminOrHasAccess,
    delete: isAdminOrHasAccess,
  },
  hooks: {
    afterChange: [syncUser],
    beforeChange: [
      addUser,
      async (args) => {
        // THIS LOGIC IS FROM PAYMENT_ROUTER.ts

        // When we create a Product, we run this first
        if (args.operation === "create") {
          const data = args.data as Product;

          // Create the product with stripe
          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "USD",
              unit_amount: Math.round(data.price * 100),
            },
          });

          const updated: Product = {
            ...data,
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          };

          return updated; // add to database
        } else if (args.operation === "update") {
          const data = args.data as Product;

          const updateProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!,
          });

          const updated: Product = {
            ...data,
            stripeId: updateProduct.id,
            priceId: updateProduct.default_price as string,
          };

          return updated; // add to database
        }
      },
    ],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users", // based on the slug
      required: true,
      hasMany: false,
      admin: {
        condition: () => false, // hides from admin dashboard
      },
    },
    {
      // for product
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea", // richText -> look into documentation
      label: "Product details",
    },
    {
      name: "price",
      label: "Price in USD",
      min: 0,
      max: 1000,
      type: "number",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: "product_files",
      label: "Product file(s)",
      type: "relationship",
      required: true,
      relationTo: "product_files",
      hasMany: false, // only one file format
    },
    {
      name: "approvedForSale",
      label: "Product Status",
      type: "select",
      defaultValue: "pending",
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      options: [
        {
          label: "Pending verification",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
    },
    {
      name: "priceId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "stripeId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "images",
      type: "array",
      label: "Product images",
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
