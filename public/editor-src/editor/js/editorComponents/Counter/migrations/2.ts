import { Deps, Migration, MigrationValues } from "visual/utils/migration";
import * as Num from "visual/utils/reader/number";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";

const migrateColorHex = ({ v }: MigrationValues) => {
  if (Obj.isObject(v) && Obj.hasKey("colorHex", v)) {
    return Str.read(v.colorHex);
  }
};

const migrateColorOpacity = ({ v }: MigrationValues) => {
  if (Obj.isObject(v) && Obj.hasKey("colorOpacity", v)) {
    return Num.read(v.colorOpacity);
  }
};

const migrateColorPalette = ({ v }: MigrationValues) => {
  if (Obj.isObject(v) && Obj.hasKey("colorPalette", v)) {
    return Str.read(v.colorPalette);
  }
};

const migrateHoverColorHex = ({ v, vd, vs }: MigrationValues) => {
  if (Obj.isObject(v) && Obj.hasKey("hoverColorHex", v)) {
    return Str.read(v.hoverColorHex);
  }

  const merged = { ...vd, ...vs };

  if (Obj.isObject(merged) && Obj.hasKey("hoverColorHex", merged)) {
    return Str.read(merged.hoverColorHex);
  }
};

const migrateHoverColorOpacity = ({ v, vd, vs }: MigrationValues) => {
  if (Obj.isObject(v) && Obj.hasKey("hoverColorOpacity", v)) {
    return Num.read(v.hoverColorOpacity);
  }

  const merged = { ...vd, ...vs };

  if (Obj.isObject(merged) && Obj.hasKey("hoverColorOpacity", merged)) {
    return Num.read(merged.hoverColorOpacity);
  }
};

const migrateHoverColorPalette = ({ v, vd, vs }: MigrationValues) => {
  if (Obj.isObject(v) && Obj.hasKey("hoverColorPalette", v)) {
    return Str.read(v.hoverColorPalette);
  }

  const merged = { ...vd, ...vs };

  if (Obj.isObject(merged) && Obj.hasKey("hoverColorPalette", merged)) {
    return Str.read(merged.hoverColorPalette);
  }
};

export const m2: Migration<Deps<unknown>> = {
  version: 2,
  cb(data) {
    if (!Obj.isObject(data.v)) {
      throw new Error(
        `Counter colorHex/colorOpacity/colorPalette/hoverColor* migration failed ${data.v}`
      );
    }

    const colorHex = migrateColorHex(data);
    const colorOpacity = migrateColorOpacity(data);
    const colorPalette = migrateColorPalette(data);
    const hoverColorHex = migrateHoverColorHex(data);
    const hoverColorOpacity = migrateHoverColorOpacity(data);
    const hoverColorPalette = migrateHoverColorPalette(data);

    if (
      colorHex !== undefined ||
      colorOpacity !== undefined ||
      colorPalette !== undefined ||
      hoverColorHex !== undefined ||
      hoverColorOpacity !== undefined ||
      hoverColorPalette !== undefined
    ) {
      return {
        ...data.v,
        ...(colorHex !== undefined && { prefixSuffixColorHex: colorHex }),
        ...(colorOpacity !== undefined && {
          prefixSuffixColorOpacity: colorOpacity
        }),
        ...(colorPalette !== undefined && {
          prefixSuffixColorPalette: colorPalette
        }),
        ...(hoverColorHex !== undefined && {
          hoverPrefixSuffixColorHex: hoverColorHex
        }),
        ...(hoverColorOpacity !== undefined && {
          hoverPrefixSuffixColorOpacity: hoverColorOpacity
        }),
        ...(hoverColorPalette !== undefined && {
          hoverPrefixSuffixColorPalette: hoverColorPalette
        })
      };
    }

    return data.v;
  }
};
