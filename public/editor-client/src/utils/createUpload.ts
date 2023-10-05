import { t } from "./i18n";

interface Data<T extends boolean> {
  accept?: string;
  multiple?: T;
}

type FileOrFiles<T extends true | false> = T extends true ? Array<File> : File;

export const createUpload = <T extends boolean = false>(
  data?: Data<T>
): Promise<FileOrFiles<T>> => {
  let lock = false;
  return new Promise((resolve, reject) => {
    const { accept, multiple } = data ?? {};
    const el = document.createElement("input");

    el.style.display = "none";
    el.setAttribute("id", String(+new Date()));
    el.setAttribute("type", "file");

    if (accept) {
      el.setAttribute("accept", accept);
    }
    if (multiple !== undefined) {
      el.setAttribute("multiple", `${multiple}`);
    }

    document.body.appendChild(el);

    const handleChange = function () {
      lock = true;
      const files = el.files;

      if (files) {
        if (multiple) {
          resolve(Array.from(files) as FileOrFiles<T>);
        } else {
          resolve(files[0] as FileOrFiles<T>);
        }
      } else {
        reject(t("File not Selected"));
      }
      const elInDom = document.getElementById(el.id);

      if (elInDom) {
        document.body.removeChild(elInDom);
      }
    };
    const handleFocus = function () {
      setTimeout(() => {
        const elInDom = document.getElementById(el.id);

        if (!lock && elInDom) {
          reject("cancel");
          document.body.removeChild(elInDom);
        }
      }, 300);
    };

    el.addEventListener("change", handleChange, { once: true });
    window.addEventListener("focus", handleFocus, { once: true });

    // open file select box
    el.click();
  });
};
