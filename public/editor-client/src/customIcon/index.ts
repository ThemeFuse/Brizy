import { deleteIcon as apiDeleteIcon, getCustomIcons } from "../api";
import { CustomIcon, IconData } from "../types/Icon";
import { createUpload } from "../utils/createUpload";
import { t } from "../utils/i18n";
import { uploadIcon } from "./utils";

export const customIcon: CustomIcon = {
  async get(res, rej) {
    try {
      const icons = await getCustomIcons();

      const normalizedIcons = icons.map(({ uid }) => ({
        name: uid
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

      const uploadedIcons = await Promise.all(
        icons.map(
          (icon) =>
            new Promise<IconData>((resolve) => {
              uploadIcon(
                icon,
                ({ uid }) => {
                  resolve({
                    name: uid
                  });
                },
                () => {
                  rej(t("Failed to upload icon"));
                }
              );
            })
        )
      );

      res(uploadedIcons);
    } catch (e) {
      rej(t("Icon upload cancelled"));
    }
  },

  async delete(res, rej, { uid }) {
    try {
      await apiDeleteIcon(uid);
      res(uid);
    } catch (e) {
      rej(t("Failed to delete icon"));
    }
  }
};
