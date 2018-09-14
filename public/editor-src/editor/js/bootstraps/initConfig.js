import Config from "visual/global/Config";
import templateIcons from "visual-template/config/icons";
import templateFonts from "visual-template/config/fonts";

const visualConfig = global.__VISUAL_CONFIG__;
const templateConfig = {
  icons: templateIcons,
  fonts: templateFonts
};

Config.load(visualConfig);
Config.load(templateConfig);
