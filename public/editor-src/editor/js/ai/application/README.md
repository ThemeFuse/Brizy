# Application

Interfaces (ports) that define contracts between the adapter layer and the infrastructure layer. No implementations live here.

## Interfaces

### `IToolServer` (`i-tool-server.ts`)

MCP-like server interface consumed by the AI chat client.

```typescript
interface IToolServer {
  listTools(): ToolDefinition[];
  callTool(request: ToolCallRequest): Promise<ToolExecutionResponse>;
}
```

### `IPageRepository` (`i-page-repository.ts`)

Abstracts Redux state access for page-level data: blocks, elements, search, icons.

| Method group   | Methods                                                              |
|----------------|----------------------------------------------------------------------|
| Read           | `getPageStructure`, `getElementById`, `searchElements`, `isPro`, `getAvailableIcons` |
| Block          | `addBlock`, `removeBlock`, `moveBlock`, `duplicateBlock`, `clearPage`, `insertTemplate` |
| Element        | `addElement`, `removeElement`, `updateElement`, `updateColumn`, `duplicateElement`, `moveElement`, `updateRichText` |

Also defines param types: `AddBlockParams`, `InsertTemplateParams`, `AddElementParams`, `SearchElementsParams`, `RemoveElementParams`, `UpdateElementParams`, `MoveElementParams`, `DuplicateElementParams`, `UpdateRichTextParams`, `GetAvailableIconsParams`.

### `IProjectRepository` (`i-project-repository.ts`)

Abstracts Redux state access for project-level data: styles and fonts.

| Method group | Methods                                                         |
|--------------|-----------------------------------------------------------------|
| Styles       | `getProjectStyles`, `changeStyle`, `addStyle`, `duplicateStyle` |
| Fonts        | `getProjectFonts`, `getGoogleFonts`, `addFont`, `deleteFont`, `changeDefaultFont` |

Also defines lightweight summary types for LLM consumption:

| Type               | Purpose                                      |
|--------------------|----------------------------------------------|
| `StyleSummary`     | id + title only                              |
| `FontStyleSummary` | Desktop-only typography props (no responsive)|
| `StyleDetail`      | id + title + colorPalette + fontStyles       |
| `FontSummary`      | brizyId + family + type + category           |
| `GoogleFontSummary`| family + category + variants + weights       |
| `AddFontParams`    | Discriminated union: google \| adobe         |
