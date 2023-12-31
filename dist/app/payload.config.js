"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var path_1 = __importDefault(require("path"));
var config_1 = require("payload/config");
var Users_1 = require("../collections/Users");
var Products_1 = require("../collections/Products/Products");
var Media_1 = require("../collections/Media");
var ProductFiles_1 = require("../collections/ProductFiles");
var Orders_1 = require("../collections/Orders");
// Don't need this
// import dotenv from "dotenv";
// dotenv.config({
//   path: path.resolve(__dirname, "../.env"),
// });
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
    collections: [Users_1.Users, Products_1.Products, Media_1.Media, ProductFiles_1.ProductFiles, Orders_1.Orders],
    routes: {
        admin: "/sell",
    },
    // Need to add this user: "users" because we added unique "users" collection property
    admin: {
        user: "users",
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: "- DigitalHippo",
            favicon: "/favicon.ico",
            ogImage: "/thumbnail.jpg",
        },
    },
    rateLimit: {
        max: 2000,
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGODB_URL,
    }),
    // puts all of our types from our users and db into this
    typescript: {
        outputFile: path_1.default.resolve(__dirname, "payload-types.ts"),
    },
});
