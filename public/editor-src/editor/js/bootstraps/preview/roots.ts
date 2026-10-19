// A native node, or the jQuery set that HTML compiled by an older version still sends
export type InitPayload = HTMLElement | ArrayLike<HTMLElement>;

export const rootsOf = (payload: InitPayload): HTMLElement[] =>
  payload instanceof HTMLElement ? [payload] : Array.from(payload);
