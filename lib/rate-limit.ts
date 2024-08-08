import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export async function rateLimit(identifier: string, commands: number) {
    const rateLimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(commands, "10 s"),
        analytics: true,
        prefix: "@upstash/ratelimit"
    });

    return await rateLimit.limit(identifier);
}