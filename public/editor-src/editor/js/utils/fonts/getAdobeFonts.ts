import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getAdobeFonts } from "visual/utils/api";

export const normalizeAdobeFonts = async (config: ConfigCommon, id: string) => {
  try {
    const fonts = await getAdobeFonts(config);
    return {
      adobe: {
        id,
        data: fonts.kit.families
      }
    };
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error(e);
    }

    return {};
  }
};
