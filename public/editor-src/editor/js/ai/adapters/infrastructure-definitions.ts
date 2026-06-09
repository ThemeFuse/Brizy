import type { ToolDefinition } from "../entities/models";

/**
 * Infrastructure tool definitions: read tools, block tools, and generic element tools.
 * These are NOT component-specific — they deal with page structure, blocks, and generic element operations.
 */

// ===========================================
// READ TOOLS
// ===========================================

export const getPageStructureDefinition: ToolDefinition = {
  name: "getPageStructure",
  strict: true,
  description:
    "Get the hierarchical structure of the page including all blocks, rows, columns, and elements. Use this to understand the current page layout before making changes. Returns block IDs, element types, and nested structure.",
  category: "read",
  parameters: {
    type: "object",
    properties: {
      depth: {
        type: "number",
        description:
          "How deep to traverse the element tree. Omit for full depth. Use lower values (e.g. 2-3) to limit output size.",
        minimum: 1
      }
    },
    additionalProperties: false
  }
};

export const getElementByIdDefinition: ToolDefinition = {
  name: "getElementById",
  strict: true,
  description:
    "Get detailed information about a specific element by its ID, including all its properties and current values. Use this to inspect an element before modifying it.",
  category: "read",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "The unique ID of the element to retrieve"
      }
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const searchElementsDefinition: ToolDefinition = {
  name: "searchElements",
  strict: true,
  description:
    "Search for elements matching specific criteria like type, text content, or regex patterns. Returns matching elements with their IDs and paths. Supports regex for advanced filtering.",
  category: "read",
  parameters: {
    type: "object",
    properties: {
      type: {
        type: "string",
        description:
          "Exact element type to match (e.g., 'Button', 'RichText', 'Image', 'Row', 'Column')"
      },
      containsText: {
        type: "string",
        description:
          "Simple text search - finds elements containing this text (case-insensitive)"
      },
      textRegex: {
        type: "string",
        description:
          "Regex pattern to match text content (e.g., '\\\\d+' for numbers, 'price|cost' for price-related text)"
      },
      blockId: {
        type: "string",
        description:
          "Search only within a specific block. If not provided, searches entire page."
      },
      limit: {
        type: "number",
        description: "Maximum number of results (default: 20)",
        minimum: 1,
        maximum: 100
      }
    },
    additionalProperties: false
  }
};

export const getAvailableIconsDefinition: ToolDefinition = {
  name: "getAvailableIcons",
  strict: true,
  description:
    "Get available icons. Returns a list of icon objects with exact 'name', 'title', and 'type' fields. CRITICAL: You MUST call this BEFORE setting any icon on ANY element and use the exact 'name' and 'type' values from the results. NEVER invent, guess, or fabricate icon names — only names returned here are valid. Using a non-existent name will break the UI.",
  category: "read",
  parameters: {
    type: "object",
    properties: {
      iconType: {
        type: "string",
        enum: ["outline", "glyph", "fa"],
        description:
          "Icon type to search. 'outline' for outline icons, 'glyph' for filled icons, 'fa' for FontAwesome. Omit to search all types."
      },
      search: {
        type: "string",
        description:
          "Search term to filter icons by name or title (e.g., 'star', 'heart', 'arrow')"
      },
      limit: {
        type: "number",
        description: "Maximum number of icons to return (default: 50)",
        minimum: 1,
        maximum: 200
      }
    },
    required: ["iconType"],
    additionalProperties: false
  }
};

export const isProDefinition: ToolDefinition = {
  name: "isPro",
  strict: true,
  description:
    "IMPORTANT: Check if the current user has Brizy Pro. You MUST call this BEFORE using any pro-only features. Properties marked '(PRO ONLY)' in tool descriptions REQUIRE a Pro subscription — if the user is not Pro, you MUST NOT set those properties, they will have no effect and may cause errors.",
  category: "read",
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false
  }
};

export const getGoogleFontsDefinition: ToolDefinition = {
  name: "getGoogleFonts",
  strict: true,
  description:
    "Search the Google Fonts library to find available fonts. MUST be called before addFont with type 'google' to verify the font exists. Returns matching font families with their details.",
  category: "read",
  parameters: {
    type: "object",
    properties: {
      search: {
        type: "string",
        description:
          "Search term to filter fonts by family name (e.g., 'Roboto', 'Open Sans')"
      },
      limit: {
        type: "number",
        description: "Maximum number of results (default: 20)",
        minimum: 1,
        maximum: 100
      }
    },
    required: ["search"],
    additionalProperties: false
  }
};

// ===========================================
// BLOCK TOOLS
// ===========================================

export const addBlocksDefinition: ToolDefinition = {
  name: "addBlocks",
  strict: true,
  description:
    "Insert one or more blocks into the page in a single call. Each entry can use blockRef (from generateBlock) OR blockData (raw JSON). Preferred workflow: generate all blocks first, then call addBlocks once with the full array. For a single block, pass an array of length 1. To modify EXISTING sections, use element tools (addButton, addText, etc.) instead.",
  category: "block",
  parameters: {
    type: "object",
    properties: {
      blocks: {
        type: "array",
        description:
          "Array of blocks to insert, in the order they should appear. Each entry is inserted independently; failures in one entry do not prevent others from being inserted.",
        items: {
          type: "object",
          properties: {
            blockType: {
              type: "string",
              enum: ["Section", "SectionHeader", "SectionFooter"],
              description:
                "Block type. Use Section for content, SectionHeader for header, SectionFooter for footer."
            },
            blockRef: {
              type: "string",
              description:
                "Reference ID from generateBlock. Pass the blockRef returned by generateBlock here."
            },
            blockData: {
              type: "object",
              description:
                "Raw block JSON data to insert directly. Use this when you have the full block JSON instead of a blockRef."
            },
            insertIndex: {
              type: "number",
              description:
                "Position to insert (0-indexed). Omit to append at end.",
              minimum: 0
            }
          },
          required: ["blockType"],
          additionalProperties: false
        }
      }
    },
    required: ["blocks"],
    additionalProperties: false
  }
};

export const addBlankBlockDefinition: ToolDefinition = {
  name: "addBlankBlock",
  strict: true,
  description:
    "Add an empty blank block (section) to the page with no content. Use this when you need to create a new empty section and then populate it with elements using add tools (addText, addButton, addRow, etc.).",
  category: "block",
  parameters: {
    type: "object",
    properties: {
      blockType: {
        type: "string",
        enum: ["Section", "SectionHeader", "SectionFooter"],
        description:
          "Block type. Use Section for content (default), SectionHeader for header, SectionFooter for footer."
      },
      insertIndex: {
        type: "number",
        description: "Position to insert (0-indexed). Omit to add at end.",
        minimum: 0
      },
      paddingTop: {
        type: "number",
        description: "Top padding of the section in pixels",
        minimum: 0
      },
      paddingBottom: {
        type: "number",
        description: "Bottom padding of the section in pixels",
        minimum: 0
      },
      bgColorHex: {
        type: "string",
        description: "Background color hex (e.g., '#FF0000')"
      },
      bgColorOpacity: {
        type: "number",
        description: "Background color opacity (0-1)",
        minimum: 0,
        maximum: 1
      }
    },
    additionalProperties: false
  }
};

export const removeBlockDefinition: ToolDefinition = {
  name: "removeBlock",
  strict: true,
  description:
    "Remove a section block from the page. Provide either blockId or blockIndex.",
  category: "block",
  parameters: {
    type: "object",
    properties: {
      blockId: {
        type: "string",
        description: "ID of the block to remove"
      },
      blockIndex: {
        type: "number",
        description: "Index of the block (alternative to blockId)",
        minimum: 0
      }
    },
    additionalProperties: false
  }
};

export const clearPageDefinition: ToolDefinition = {
  name: "clearPage",
  strict: true,
  description:
    "Remove all blocks from the page, leaving it completely empty. Use this when the user wants to start fresh or clear the entire page.",
  category: "block",
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false
  }
};

export const moveBlockDefinition: ToolDefinition = {
  name: "moveBlock",
  strict: true,
  description: "Move a block to a different position in the page.",
  category: "block",
  parameters: {
    type: "object",
    properties: {
      blockId: {
        type: "string",
        description: "ID of the block to move"
      },
      toIndex: {
        type: "number",
        description: "Target index position",
        minimum: 0
      }
    },
    required: ["toIndex"],
    additionalProperties: false
  }
};

export const duplicateBlockDefinition: ToolDefinition = {
  name: "duplicateBlock",
  strict: true,
  description:
    "Create a copy of an existing block with all its contents. The duplicate will have new unique IDs.",
  category: "block",
  parameters: {
    type: "object",
    properties: {
      blockId: {
        type: "string",
        description: "ID of the block to duplicate"
      },
      insertAfter: {
        type: "boolean",
        description: "Insert after original (true, default) or before (false)"
      }
    },
    additionalProperties: false
  }
};

// ===========================================
// PROJECT TOOLS - Styles & Fonts
// ===========================================

export const getProjectStylesDefinition: ToolDefinition = {
  name: "getProjectStyles",
  strict: true,
  description:
    "Get all available global styles and the currently active style. Returns built-in styles, user-created (extra) styles, the active style ID, and the current style's color palette and font styles.",
  category: "read",
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false
  }
};

export const changeStyleDefinition: ToolDefinition = {
  name: "changeStyle",
  strict: true,
  description:
    "Switch the active global style by its ID. Use getProjectStyles first to see available style IDs.",
  category: "project",
  parameters: {
    type: "object",
    properties: {
      styleId: {
        type: "string",
        description: "The ID of the style to activate"
      }
    },
    required: ["styleId"],
    additionalProperties: false
  }
};

export const addStyleDefinition: ToolDefinition = {
  name: "addStyle",
  strict: true,
  description:
    "Create a new global style with a custom color palette and/or font styles. The new style becomes the active style. Provide a title and at least a colorPalette or fontStyles.",
  category: "project",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Display name for the new style"
      },
      colorPalette: {
        type: "array",
        description:
          "Array of 8 color objects with id (color1-color8) and hex value. All 8 colors are required if provided.",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              enum: [
                "color1",
                "color2",
                "color3",
                "color4",
                "color5",
                "color6",
                "color7",
                "color8"
              ],
              description: "Palette slot ID"
            },
            hex: {
              type: "string",
              description: "Hex color value (e.g., '#FF0000')"
            }
          },
          required: ["id", "hex"],
          additionalProperties: false
        }
      },
      fontStyles: {
        type: "array",
        description:
          "Array of font style objects. If omitted, copies font styles from the current active style.",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "Font style ID (e.g., 'paragraph', 'heading1', 'heading2')"
            },
            title: {
              type: "string",
              description: "Display title"
            },
            fontFamily: {
              type: "string",
              description:
                "Font family in builder format: lowercase with underscores (e.g. 'open_sans', 'allura', 'playfair_display'). The system auto-normalizes, but prefer this format."
            },
            fontFamilyType: {
              type: "string",
              enum: ["google", "upload", "adobe", "system"],
              description: "Font source type"
            },
            fontSize: {
              type: "number",
              description: "Font size in pixels"
            },
            fontWeight: {
              type: "number",
              description: "Font weight (100-900)"
            },
            lineHeight: {
              type: "number",
              description: "Line height multiplier"
            },
            letterSpacing: {
              type: "number",
              description: "Letter spacing value"
            }
          },
          required: [
            "id",
            "title",
            "fontFamily",
            "fontSize",
            "fontWeight",
            "lineHeight",
            "letterSpacing"
          ],
          additionalProperties: false
        }
      }
    },
    required: ["title"],
    additionalProperties: false
  }
};

export const updateProjectStyleDefinition: ToolDefinition = {
  name: "updateProjectStyle",
  strict: true,
  description:
    "Update the current active style's color palette and/or font styles in place. Unlike addStyle (which creates a new style), this modifies the existing active style. Use getProjectStyles first to see current values. Provide only the properties you want to change — font styles are merged by id.",
  category: "project",
  parameters: {
    type: "object",
    properties: {
      colorPalette: {
        type: "array",
        description:
          "Array of 8 color objects with id (color1-color8) and hex value. All 8 colors are required if provided.",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              enum: [
                "color1",
                "color2",
                "color3",
                "color4",
                "color5",
                "color6",
                "color7",
                "color8"
              ],
              description: "Palette slot ID"
            },
            hex: {
              type: "string",
              description: "Hex color value (e.g., '#FF0000')"
            }
          },
          required: ["id", "hex"],
          additionalProperties: false
        }
      },
      fontStyles: {
        type: "array",
        description:
          "Array of font style updates. Only the id is required — include only the properties you want to change. Unmentioned font styles keep their current values.",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "Font style ID to update (e.g., 'paragraph', 'heading1', 'heading2')"
            },
            fontFamily: {
              type: "string",
              description:
                "Font family in builder format: lowercase with underscores (e.g. 'open_sans', 'allura', 'playfair_display'). The system auto-normalizes, but prefer this format."
            },
            fontFamilyType: {
              type: "string",
              enum: ["google", "upload", "adobe", "system"],
              description: "Font source type"
            },
            fontSize: {
              type: "number",
              description: "Font size in pixels"
            },
            fontWeight: {
              type: "number",
              description: "Font weight (100-900)"
            },
            lineHeight: {
              type: "number",
              description: "Line height multiplier"
            },
            letterSpacing: {
              type: "number",
              description: "Letter spacing value"
            }
          },
          required: ["id"],
          additionalProperties: false
        }
      }
    },
    additionalProperties: false
  }
};

export const duplicateStyleDefinition: ToolDefinition = {
  name: "duplicateStyle",
  strict: true,
  description:
    "Duplicate the current active style. Creates a copy with a new ID and optional new title. The duplicate becomes the active style.",
  category: "project",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description:
          "Title for the duplicated style. If omitted, appends ' (Copy)' to the original title."
      }
    },
    additionalProperties: false
  }
};

export const getProjectFontsDefinition: ToolDefinition = {
  name: "getProjectFonts",
  strict: true,
  description:
    "Get all fonts used in the project, grouped by type (google, upload, adobe, system). Also returns the default font. CRITICAL: You MUST call this BEFORE setting fontFamily on ANY element to verify the font exists in the project. NEVER guess or invent font names — only fonts returned here are valid. If the font you need is not in the project, use addFont to add it first.",
  category: "read",
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false
  }
};

export const addFontDefinition: ToolDefinition = {
  name: "addFont",
  strict: true,
  description:
    "Add a font to the project. Supports two font types: 'google' (search by family name from the Google Fonts library) or 'adobe' (connect an Adobe Fonts kit by its project ID). For google fonts, call getGoogleFonts first to find the exact family name.",
  category: "project",
  parameters: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["google", "adobe"],
        description: "Font source type"
      },
      family: {
        type: "string",
        description:
          "Font family name. Required for 'google' type. Must match an exact family from getGoogleFonts."
      },
      adobeKitId: {
        type: "string",
        description:
          "Adobe Fonts project/kit ID. Required for 'adobe' type. Found in the user's Adobe Fonts account under Web Projects."
      },
      setAsDefault: {
        type: "boolean",
        description: "If true, also set this font as the project default font"
      }
    },
    required: ["type"],
    additionalProperties: false
  }
};

export const deleteFontDefinition: ToolDefinition = {
  name: "deleteFont",
  strict: true,
  description:
    "Remove a font from the project by its brizyId. Use getProjectFonts first to find the brizyId.",
  category: "project",
  parameters: {
    type: "object",
    properties: {
      brizyId: {
        type: "string",
        description: "The brizyId of the font to remove"
      },
      type: {
        type: "string",
        enum: ["google", "upload", "adobe"],
        description: "The font type/source"
      }
    },
    required: ["brizyId", "type"],
    additionalProperties: false
  }
};

export const changeDefaultFontDefinition: ToolDefinition = {
  name: "changeDefaultFont",
  strict: true,
  description:
    "Change the project's default font. Use getProjectFonts to see available fonts and their family names.",
  category: "project",
  parameters: {
    type: "object",
    properties: {
      font: {
        type: "string",
        description:
          "Font family in builder format: lowercase with underscores (e.g. 'open_sans', 'allura'). The system auto-normalizes, but prefer this format."
      }
    },
    required: ["font"],
    additionalProperties: false
  }
};

// ===========================================
// ELEMENT TOOLS - Generic
// ===========================================

export const removeElementDefinition: ToolDefinition = {
  name: "removeElement",
  strict: true,
  description: "Remove an element from the page by its ID.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the element to remove"
      }
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const duplicateElementDefinition: ToolDefinition = {
  name: "duplicateElement",
  strict: true,
  description:
    "Create a copy of an existing element. The duplicate will be inserted after the original by default.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the element to duplicate"
      },
      insertAfter: {
        type: "boolean",
        description: "Insert after original (true, default) or before (false)"
      }
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const moveElementDefinition: ToolDefinition = {
  name: "moveElement",
  strict: true,
  description:
    "Move an element to a different position within the same container or to a different container.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the element to move"
      },
      targetContainerId: {
        type: "string",
        description:
          "ID of the target container (can be the same as current container)"
      },
      targetIndex: {
        type: "number",
        description: "Target position within the container (0-indexed)",
        minimum: 0
      }
    },
    required: ["elementId", "targetContainerId"],
    additionalProperties: false
  }
};

/**
 * All infrastructure tool definitions in order.
 */
export const infrastructureDefinitions: ToolDefinition[] = [
  // Read tools
  getPageStructureDefinition,
  getElementByIdDefinition,
  searchElementsDefinition,
  getAvailableIconsDefinition,
  isProDefinition,
  getGoogleFontsDefinition,
  // Block tools
  addBlocksDefinition,
  addBlankBlockDefinition,
  removeBlockDefinition,
  clearPageDefinition,
  moveBlockDefinition,
  duplicateBlockDefinition,
  // Project tools - Styles & Fonts
  getProjectStylesDefinition,
  changeStyleDefinition,
  addStyleDefinition,
  updateProjectStyleDefinition,
  duplicateStyleDefinition,
  getProjectFontsDefinition,
  addFontDefinition,
  deleteFontDefinition,
  changeDefaultFontDefinition,
  // Generic element tools
  removeElementDefinition,
  duplicateElementDefinition,
  moveElementDefinition
];
