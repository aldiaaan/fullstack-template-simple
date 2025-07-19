import Redis from "ioredis";
import { singleton } from "~/utils/singleton";

export const redis = singleton(
  "redis",
  () =>
    new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
    })
);

export const redis2 = singleton(
  "redis2",
  () =>
    new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
    })
);
