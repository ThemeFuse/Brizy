interface Symbols {
  type: "symbols";
  uid: string;
}

interface Position {
  type: "position";
  position: "top" | "bottom";
}

type Block = Symbols | Position;

export const getGlobalBlockPlaceholder = (block: Block): string => {
  if (block.type === "symbols") {
    return `{{ brizy_dc_global_block uid='${block.uid}' }} `;
  }

  return `{{ brizy_dc_global_blocks position='${block.position}' }}`;
};
