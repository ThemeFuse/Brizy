export default function getVideoData(input) {
  let type = null;
  let keyMatch;

  if (/(?:youtu\.be|youtube)/.test(input)) {
    type = "youtube";
    keyMatch = input.match(
      /(?:v=|embed\/|youtu\.be\/)([A-Z0-9a-z\-_+%]*)(?:"|)/
    );
  } else if (/(?:vimeo\.com)/.test(input)) {
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
