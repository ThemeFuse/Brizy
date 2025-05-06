import { uploadFont } from "visual/utils/api";
import { CreateFont } from "../api/types";
import { getFontVariations, normalizeFonts } from "./utils";

export const createFont = async ({ id, name, files, config }: CreateFont) => {
  const variations = (await getFontVariations(files)).flat();

  const font = await uploadFont(
    {
      id,
      name,
      files
    },
    config
  );

  return normalizeFonts(
    {
      data: font
    },
    variations
  );
};
