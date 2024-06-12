import { addProjectLockedBeacon, removeProjectLockedSendBeacon } from "../api";
import { Config } from "../config";

export function onStartLoad(config: Config) {
  const {
    actions: { lockProject, removeLock },
    project: { status },
    url,
    hash,
    editorVersion
  } = config;

  return async () => {
    if (!status.locked) {
      await addProjectLockedBeacon({
        lockProject,
        url,
        hash,
        version: editorVersion
      });
    }

    window.parent.addEventListener(
      "unload",
      removeProjectLockedSendBeacon({
        removeLock,
        url,
        version: editorVersion
      }),
      false
    );
  };
}
