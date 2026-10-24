/**
 * @rocketcast/overlay
 *
 * Overlay templates and render function. A renderer binds to exactly one
 * `sessionId` and is torn down on session change (SPEC §6 invariants).
 * M00 ships only the canvas constants; templates arrive in M05.
 */

/** Output canvas for every overlay frame (1080p, 16:9). */
export const OVERLAY_CANVAS = { width: 1920, height: 1080 } as const;

export type OverlayCanvas = typeof OVERLAY_CANVAS;
