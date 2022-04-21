export default function videoUrlOriginal(type: string, key: string): string {
  switch (type) {
    case "youtube":
      return "https://www.youtube.com/watch?v=" + key;
    case "vimeo":
      return "https://vimeo.com/" + key;
    default:
      return "";
  }
}
