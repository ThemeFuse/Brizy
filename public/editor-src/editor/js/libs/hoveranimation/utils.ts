export const getKeyframe = (keyframeEncoded: string): Keyframe[] => {
  return JSON.parse(decodeURI(keyframeEncoded));
};
