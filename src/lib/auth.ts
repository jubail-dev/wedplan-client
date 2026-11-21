import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient, type Db } from "mongodb";
import { jwt } from "better-auth/plugins";

const configuredMongoUri = process.env.MONGODB_URI;

if (!configuredMongoUri) {
  throw new Error("MONGODB_URI is not configured");
}

const MONGODB_URI: string = configuredMongoUri;

/**
 * Vercel keeps the Node.js process alive across warm invocations, so the
 * MongoClient is cached on globalThis. When a connection attempt fails, the
 * MongoDB driver closes the client's topology and every later operation
 * throws "MongoTopologyClosedError: Topology is closed". Only healthy clients
 * are reused; a dead one is replaced on the next access.
 */
type MongoCache = {
  client: MongoClient;
  connectPromise: Promise<MongoClient> | null;
};

type TopologyLike = {
  isDestroyed?: () => boolean;
};

const globalForMongo = globalThis as typeof globalThis & {
  _wedplanMongoCache?: MongoCache;
};

function createMongoClient(): MongoClient {
  return new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
}

function topologyIsClosed(client: MongoClient): boolean {
  // `topology` is internal to the driver but stable in mongodb 7.x. With no
  // topology yet the driver connects lazily on the first operation.
  const topology = (client as MongoClient & { topology?: TopologyLike })
    .topology;
  return typeof topology?.isDestroyed === "function" && topology.isDestroyed();
}

function startConnect(cache: MongoCache): void {
  const client = cache.client;
  const connectPromise = client.connect();
  cache.connectPromise = connectPromise;

  // Surface the real infrastructure error (network, IP allowlist, auth,
  // timeout) instead of hiding it behind MongoTopologyClosedError. Clearing
  // the promise makes the next request retry with a fresh client.
  void connectPromise.catch((error: unknown) => {
    console.error("[auth] MongoDB connection failed:", error);
    if (cache.connectPromise === connectPromise) {
      cache.connectPromise = null;
    }
  });
}

function getHealthyClient(): MongoClient {
  let cache = globalForMongo._wedplanMongoCache;

  if (!cache) {
    cache = { client: createMongoClient(), connectPromise: null };
    globalForMongo._wedplanMongoCache = cache;
  } else if (topologyIsClosed(cache.client)) {
    // Never reuse a client whose topology the driver has already closed.
    const deadClient = cache.client;
    cache = { client: createMongoClient(), connectPromise: null };
    globalForMongo._wedplanMongoCache = cache;
    void deadClient.close().catch(() => {});
  }

  if (!cache.connectPromise) {
    startConnect(cache);
  }

  return cache.client;
}

/**
 * Better Auth's MongoDB adapter binds `db` and `client` when `auth` is created
 * and exposes no per-operation hook. These thin resolvers route every adapter
 * operation through getHealthyClient(), so a failed connection is retried
 * instead of permanently poisoning all following requests. This keeps the
 * officially supported mongodbAdapter configuration and transactions intact.
 */
const db = new Proxy({} as Db, {
  get(_target, property) {
    const currentDb = getHealthyClient().db("wedplan");
    const value = Reflect.get(currentDb, property, currentDb);
    return typeof value === "function" ? value.bind(currentDb) : value;
  },
});

const mongoClient = new Proxy({} as MongoClient, {
  get(_target, property) {
    const currentClient = getHealthyClient();
    const value = Reflect.get(currentClient, property, currentClient);
    return typeof value === "function" ? value.bind(currentClient) : value;
  },
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: ["https://wedplan-client-two.vercel.app"],

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
