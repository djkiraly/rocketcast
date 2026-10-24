/**
 * @rocketcast/protocol
 *
 * Realtime envelope (SPEC §14). Every message between scorer, realtime
 * Durable Object, and overlay renderer is wrapped in this envelope.
 * Per-`type` payload schemas arrive in M04.
 */
import { z } from "zod";

/** Message kinds carried by an envelope (SPEC §14). */
export const ENVELOPE_TYPES = ["snapshot", "event", "theme", "control"] as const;

export const EnvelopeTypeSchema = z.enum(ENVELOPE_TYPES);
export type EnvelopeType = z.infer<typeof EnvelopeTypeSchema>;

/**
 * Realtime envelope, SPEC §14:
 * - `v`         protocol version, currently 1
 * - `sessionId` stream session ("none" for non-streamed scoring)
 * - `gameId`, `teamId` scoping keys; renderers drop mismatched sessionIds
 * - `seq`       monotonic per session; a gap triggers a snapshot request
 * - `ts`        server time, ISO 8601
 * - `payload`   validated per `type` by downstream schemas
 */
export const EnvelopeSchema = z.object({
  v: z.literal(1),
  sessionId: z.string(),
  gameId: z.string(),
  teamId: z.string(),
  seq: z.number().int().nonnegative(),
  ts: z.iso.datetime({ offset: true }),
  type: EnvelopeTypeSchema,
  payload: z.unknown(),
});

export type Envelope = z.infer<typeof EnvelopeSchema>;
