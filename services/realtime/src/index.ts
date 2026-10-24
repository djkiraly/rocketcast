import { DurableObject } from "cloudflare:workers";

import { matchSessionPath } from "./router";

const SEQ_KEY = "seq";

/**
 * Hello-world Durable Object: one instance per stream session (SPEC §14).
 * M05 replaces the body with snapshot + ordered fan-out; the shape (one DO per sessionId,
 * monotonic `seq` kept in storage) is already the real one.
 */
export class SessionDO extends DurableObject<Env> {
  override async fetch(_request: Request): Promise<Response> {
    // Input gates serialize events per object, so this read-modify-write is atomic.
    const previous = (await this.ctx.storage.get<number>(SEQ_KEY)) ?? 0;
    const seq = previous + 1;
    await this.ctx.storage.put(SEQ_KEY, seq);

    return Response.json({ hello: "world", id: this.ctx.id.toString(), seq });
  }
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

function methodNotAllowed(): Response {
  return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET" } });
}

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/health") {
      return request.method === "GET" ? json({ ok: true }) : methodNotAllowed();
    }

    const sessionId = matchSessionPath(pathname);
    if (sessionId !== null) {
      if (request.method !== "GET") return methodNotAllowed();
      const stub = env.SESSION.get(env.SESSION.idFromName(sessionId));
      return stub.fetch(request);
    }

    return json({ error: "not_found" }, 404);
  },
} satisfies ExportedHandler<Env>;
