import { Fonts, KitData } from "@/fonts/types";
import { FontFile } from "@/types/Fonts";

export const convertDataToLocal = (mockTypeKitData: KitData): Fonts => {
  const families = mockTypeKitData.kit.families.map((family) => ({
    id: family.id,
    family: family.name,
    category: family.slug,
    kind: "webfonts#webfont",
    subsets: [family.css_names[0]],
    variants: family.variations
  }));

  return {
    kit: {
      id: mockTypeKitData.kit.id,
      families
    }
  };
};

export const convertFilesToFormData = (files: FontFile): FormData => {
  const formData = new FormData();

  Object.entries(files).forEach(([type, filesType]) => {
    Object.entries(filesType).forEach(([fileType, file]) => {
      if (file) {
        formData.append(`fonts[${type}][${fileType}]`, file, file.name);
      }
    });
  });

  return formData;
};
