import { assetUrl } from "visual/utils/asset";

const fetchItems = async url => {
  const data = await fetch(url);
  const { items } = await data.json();

  return items;
};

export const getGoogleFonts = async () => {
  return await fetchItems(assetUrl("googleFonts.json"));
};
