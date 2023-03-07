export const hotKeysForPreview = [
  "ctrl+shift+P",
  "shift+ctrl+P",
  "cmd+shift+P",
  "shift+cmd+P",
  "right_cmd+shift+P",
  "shift+right_cmd+P"
]

export const redirectToPreview = (refForAnchor: React.RefObject<HTMLAnchorElement>): void => {
  const element = refForAnchor
  if (element.current) {
    element.current.click();
  }
}
