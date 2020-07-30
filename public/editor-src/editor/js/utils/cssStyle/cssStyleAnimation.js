import {
  styleAnimationName,
  styleAnimationDuration,
  styleAnimationDelay
} from "visual/utils/style2";

export function cssStyleAnimation({ v, device, state }) {
  const name = styleAnimationName({ v, device, state });

  return name === undefined ? "" : `animation-name:${name};`;
}

export function cssStyleAnimationDuration({ v, device, state }) {
  const duration = styleAnimationDuration({
    v,
    device,
    state
  });

  return duration === undefined ? "" : `animation-duration:${duration}ms;`;
}

export function cssStyleAnimationDelay({ v, device, state }) {
  const delay = styleAnimationDelay({ v, device, state });

  return delay === undefined ? "" : `animation-delay:${delay}ms;`;
}
