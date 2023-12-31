"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
exports.Users = {
    slug: "users",
    // Could be just true, but this adds email verification
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                return "<a href='".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token, "'>Verify account</a>");
            },
        },
    },
    access: {
        // all users can read all of this information
        read: function () { return true; },
        create: function () { return true; },
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
