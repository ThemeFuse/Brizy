import Config from "visual/global/Config";

const isWP = Config.get("wp");

export const customFileUrl = (file: string) => {
  if (!file) return null;
  const { api: { customFile: { fileUrl } = { fileUrl: undefined } } = {} } =
    Config.getAll();

  if (fileUrl) {
    const [name] = file.split("|||", 1);

    return isWP ? `${fileUrl}${name}` : `${fileUrl}/${name}`;
  }
  return undefined;
};
