import { deleteIcon as apiDeleteIcon, getCustomIcons } from "../api";
import { CustomIcon } from "../types/Icon";
import { createUpload } from "../utils/createUpload";
import { t } from "../utils/i18n";
import { uploadIcon } from "./utils";

export const customIcon: CustomIcon = {
  async get(res, rej) {
    try {
      const icons = await getCustomIcons();

      const normalizedIcons = icons.map(({ uid, filename }) => ({
        uid: uid,
        name: filename
      }));

      res(normalizedIcons);
    } catch (e) {
      rej(t("Failed to load icons"));
    }
  },

  async add(res, rej, { acceptedExtensions = [".svg", ".ico"] }) {
    try {
      const icons = await createUpload({
        accept: acceptedExtensions?.join(","),
        multiple: true
      });

      icons.forEach((icon) => {
        uploadIcon(icon, {
          onUpload({ uid, filename }) {
            res({
              uid,
              name: filename
            });
          },
          onError() {
            rej(t("Failed to upload icon"));
          }
        });
      });
    } catch (e) {
      rej(t("Icon upload cancelled"));
    }
  },

  async delete(res, rej, { uid }) {
    apiDeleteIcon(uid)
      .then(() => res(uid))
      .catch(() => rej(t("Failed to delete icon")));
  }
};
