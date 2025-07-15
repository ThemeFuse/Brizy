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
  const styles = compileProject(config, store);

  if (compiler?.assets === "html") {
    return {
      ...project,
      compiled: {
        styles: styles.map(makeStyles)
      }
    };
  }

  return { ...project, compiled: { styles } };
}
