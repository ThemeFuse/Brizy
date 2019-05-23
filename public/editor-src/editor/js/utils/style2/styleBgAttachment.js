export function styleBgAttachment({ v, isSlider }) {
  const { bgAttachment } = v;
  const backgroundAttachment = {
    none: "scroll",
    fixed: "fixed",
    animated: "scroll"
  };
  return backgroundAttachment[isSlider ? "none" : bgAttachment];
}
