import { Access, CollectionConfig } from "payload/types";
import { User } from "../app/payload-types";

const isAdminOrHasAccessToImages =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User;

    if (!user) return false;

    if (user.role === "admin") return true;

    // See just your own images
    return {
      user: {
        equals: req.user.id,
      },
    };
  };

export const Media: CollectionConfig = {
  slug: "media",
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        return { ...data, user: req.user.id };
      },
    ],
  },
  // To define what images can be seen
  access: {
    read: async ({ req }) => {
      const referer = req.headers.referer;

      // Users who are not logged into dashboard should be able to see all products, but not when they are in the admin dashboard
      if (!req.user || !referer?.includes("sell")) {
        return true;
      }

      return await isAdminOrHasAccessToImages()({ req });
    },
    delete: isAdminOrHasAccessToImages(),
    update: isAdminOrHasAccessToImages(),
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  upload: {
    staticURL: "/media",
    staticDir: "media", // could be exported to s3 bucket
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"], // allows only images to be uploaded
  },

  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};
