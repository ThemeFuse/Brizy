export default function getVideoData(
  input: string
): { type: string; key: string } | null {
  let type: string | null = null;
  let keyMatch: RegExpMatchArray | null = null;

  if (input && /(?:youtu\.be|youtube)/.test(input)) {
    type = "youtube";
    keyMatch = input
      .replace(/\/shorts\//, "/embed/")
      .match(/(?:v=|embed\/|youtu\.be\/)([A-Z0-9a-z\-_+%]*)(?:"|)/);
  } else if (input && /(?:vimeo\.com)/.test(input)) {
    type = "vimeo";
    keyMatch = input.match(/vimeo\.com.*?\/([0-9]{1,20})/);
  }

  if (!type || !(keyMatch && keyMatch[1])) {
    return null;
  }

  return {
    type,
    key: keyMatch[1]
  };
}
