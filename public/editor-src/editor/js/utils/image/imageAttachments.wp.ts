import Config from "visual/global/Config";

const configImageAttachments = Config.get("wp")?.pageAttachments?.images;

export const imageAttachments: Set<string> = new Set(
  Object.keys(
    typeof configImageAttachments === "object" ? configImageAttachments : {}
  )
);
