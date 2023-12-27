import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
  // Could be just true, but this adds email verification
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'>Verify account</a>`;
      },
    },
  },
  access: {
    // all users can read all of this information
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "role",
      defaultValue: "user",
      required: true,
      // admin: {
      //   // condition: ({req}) => req.user.role === 'admin',
      //   condition: () => false, // always hide it
      // },
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  ],
};
