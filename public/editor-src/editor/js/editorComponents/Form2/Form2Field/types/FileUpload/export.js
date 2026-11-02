import { readDataAttr } from "visual/utils/export/dataAttr";
import { onBodyClick } from "visual/utils/export/delegate";

export default function (node) {
  const withDelete = new Set();

  node.querySelectorAll(".brz-input__upload").forEach((upload) => {
    const input = upload.querySelector(":scope > .brz-input");
    const buttons = upload.querySelectorAll(".brz-button");
    const placeholders = upload.querySelectorAll(".brz-span");

    if (!input) {
      return;
    }

    input.addEventListener("change", () => {
      const file = input.files[0];
      const deletes = upload.querySelectorAll(".brz-input__upload-delete");

      if (file?.name) {
        placeholders.forEach((placeholder) => {
          placeholder.textContent = file.name;
        });
        buttons.forEach((button) => {
          button.classList.add("brz-hidden");
        });
        deletes.forEach((item) => {
          item.classList.remove("brz-hidden");
        });
        input.disabled = true;
      } else {
        resetUpload(upload);
      }

      withDelete.add(upload);
    });
  });

  onBodyClick([
    {
      selector: ".brz-input__upload-delete",
      handler: (item) => {
        const upload = item.closest(".brz-input__upload");

        if (withDelete.has(upload)) {
          resetUpload(upload);
        }
      }
    }
  ]);
}

function resetUpload(upload) {
  const input = upload.querySelector(":scope > .brz-input");

  if (input?.hasAttribute("data-brz-placeholder")) {
    const placeholder = readDataAttr(input, "brz-placeholder");

    upload.querySelectorAll(".brz-span").forEach((span) => {
      span.textContent = placeholder === undefined ? "" : String(placeholder);
    });
  }

  if (input) {
    input.value = "";
  }

  upload.querySelectorAll(".brz-button").forEach((button) => {
    button.classList.remove("brz-hidden");
  });
  upload.querySelectorAll(".brz-input__upload-delete").forEach((item) => {
    item.classList.add("brz-hidden");
  });

  setTimeout(() => {
    if (input) {
      input.disabled = false;
    }
  }, 500);
}
