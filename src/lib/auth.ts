
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not configured");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const mongoClient =
  globalForMongo.mongoClient ?? new MongoClient(MONGODB_URI);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

const db = mongoClient.db("wedplan");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    "https://wedplan-client-sigma.vercel.app",
  ],

  user: {
    additionalFields: {
      role: {
        type: ["customer", "vendor", "admin"],
        required: false,
        defaultValue: "customer",
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
        input: false,
      },
      subscriptionPlan: {
        type: ["free", "premium"],
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  database: mongodbAdapter(db, {
    client: mongoClient,
  }),

  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            role: user.role === "vendor" ? "vendor" : "customer",
          },
        }),
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          role: user.role,
          isBlocked: user.isBlocked,
        }),
      },
    }),
  ],
});
