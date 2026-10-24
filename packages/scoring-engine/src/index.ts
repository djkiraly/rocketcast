/**
 * @rocketcast/scoring-engine
 *
 * Pure volleyball scoring engine. Game state is derived by folding `game_events`
 * through this module; it has zero runtime dependencies and performs no I/O.
 * Real rules and reducers arrive in M02. M00 ships only version markers.
 */

/** Semantic version of the engine's rule implementation. */
export const ENGINE_VERSION = "0.0.0" as const;

/**
 * Version of the event/state schema this engine understands.
 * Bumped whenever the shape of persisted `game_events` or derived state changes.
 */
export const schemaVersion = 1 as const;
