import { updateProject } from "../api";
import { Publish } from "../types/Publish";

export const publish: Publish = {
  async handler(res, rej, args) {
    const { projectData } = args;

    if (projectData) {
      try {
        await updateProject(projectData, { is_autosave: 0 });
        res(args);
      } catch (e) {
        rej("Failed to update project");
      }
    }
  }
};
