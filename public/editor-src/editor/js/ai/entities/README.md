# Entities

Domain models shared across all layers. No dependencies on other AI module layers.

## File: `models.ts`

### Tool Types

| Type                    | Purpose                                              |
|-------------------------|------------------------------------------------------|
| `ToolParameterSchema`   | JSON Schema object describing tool parameters        |
| `ToolDefinition`        | Tool metadata sent to LLM (name, description, params)|
| `ToolExecutionResponse` | Result returned after tool execution                 |
| `ToolHandler`           | Function signature `(args) => Promise<unknown> \| unknown` |

### Page / Element Types

| Type                  | Purpose                                           |
|-----------------------|---------------------------------------------------|
| `ElementSummary`      | Lightweight element node in page tree             |
| `BlockSummary`        | Block node with children                          |
| `PageStructure`       | Full page tree (blocksOrder + blocks)             |
| `ElementDetails`      | Full element data from getElementById             |
| `SearchResultItem`    | Single search match                               |
| `SearchElementsResult`| Search response with matches + counts             |

### Result Types

| Type                  | Purpose                                           |
|-----------------------|---------------------------------------------------|
| `BrizyToolResult<T>`  | Standard result envelope: `{ success, data?, error?, undoAction? }` |
| `AddBlockResult`      | blockId + insertedAt                              |
| `RemoveBlockResult`   | removedBlockId + removedAt                        |
| `AddElementResult`    | elementId + containerId + insertedAt + childElementId |
| `RemoveElementResult` | elementId + containerId + removedAt               |
| `DuplicateElementResult` | elementId + containerId + duplicatedAt         |
| `MoveElementResult`   | elementId + from/to containers + movedTo          |
| `UpdateElementResult` | elementId + elementType + previousValues          |
| `IconInfo`            | Icon entry (name, title, type)                    |
| `GetAvailableIconsResult` | Icons array + totalCount                      |
