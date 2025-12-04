import {
  ConfigCommon,
  PublishedProject
} from "visual/global/Config/types/configs/ConfigCommon";
import { Store } from "visual/redux/store";
import { Project } from "visual/types/Project";
import { makeStyles } from "../../assetManager/utils";
import { compileProject } from "../../compileProject";

export function prepareProject(
  project: Project,
  config: ConfigCommon,
  store: Store
): PublishedProject {
  const { compiler } = config;
  const compiled = compileProject(config, store);

  if (compiler?.assets === "html") {
    const { styles, fonts } = compiled;

    return {
      ...project,
      compiled: {
        styles: styles.map(makeStyles),
        fonts: fonts.map(makeStyles)
      }
    };
  }

  return { ...project, compiled };
}
