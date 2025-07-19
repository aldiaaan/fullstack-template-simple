import { Queue } from "bullmq";
import { redis } from "~/libs/redis";

const queue = new Queue("example", {
  connection: redis,
});
