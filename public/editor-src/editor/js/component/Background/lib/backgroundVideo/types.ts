/** What the markup (published page) or the editor's model says about a background video. */
export interface VideoSettings {
  type: string | undefined;
  /** Carried by the editor, ignored by every backend; the iframe src already holds it. */
  key: string | undefined;
  loop: boolean | undefined;
  start: number | string | undefined;
}

/**
 * The operations the three backends share. `mute`, `unMute` and `stop` existed on some of them and
 * were never called by anything; they are gone with the rewrite (BRZ-1391).
 */
export interface Player {
  play: () => void;
  pause: () => void;
  setLoop: (value: boolean | undefined) => void;
  seekTo: (seconds: number | string | undefined) => void;
  destroy: () => void;
}
