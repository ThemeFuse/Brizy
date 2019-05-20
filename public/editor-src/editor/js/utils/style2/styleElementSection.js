export function styleElementSectionContainerSize({ v }) {
  const { containerType, containerSize } = v;
  return containerType === "boxed" ? `${containerSize}%` : `100%`;
}
