import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getAdobeFonts } from "visual/utils/api";

export const normalizeAdobeFonts = async (
  api: ConfigCommon["api"],
  id: string
) => {
  try {
    const fonts = await getAdobeFonts(api);

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
