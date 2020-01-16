import Config from "visual/global/Config";

const isWP = Config.get("wp");

export const customFileUrl = file => {
  if (!file) return null;

  const { customFile } = Config.get("urls");
  const [name] = file.split("|||", 1);
  return isWP ? `${customFile}${name}` : `${customFile}/${name}`;
};
