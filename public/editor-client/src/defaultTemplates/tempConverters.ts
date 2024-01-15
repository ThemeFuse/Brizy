import {
  BlockWithThumbs,
  Categories,
  Kits,
  KitType
} from "../types/DefaultTemplate";

export const tempConverterKit = (
  kit: Kits,
  url: string,
  kitId: string
): {
  blocks: BlockWithThumbs[];
  categories: Categories[];
  types: KitType[];
} => {
  const blocks: BlockWithThumbs[] = kit.blocks.map(
    ({
      id,
      cat,
      pro,
      title,
      keywords,
      thumbnailWidth,
      thumbnailHeight,
      type,
      blank
    }) => ({
      id,
      cat,
      title,
      type,
      keywords,
      thumbnailHeight,
      thumbnailWidth,
      thumbnailSrc: `${url}/${id}.jpg`,
      pro: pro ?? false,
      kitId,
      blank
    })
  );

  return {
    blocks,
    categories: kit.categories,
    types: kit.types as KitType[]
  };
};
