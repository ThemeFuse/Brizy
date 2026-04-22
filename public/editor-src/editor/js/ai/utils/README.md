# Utils

Shared utilities used across all AI module layers.

## File: `logger.ts`

Debug-based logger with namespaced channels under `brizy:editor:ai`.

| Channel          | Usage                              |
|------------------|------------------------------------|
| `log.setup`      | Module initialization              |
| `log.tools`      | Tool execution (input/output)      |
| `log.ui`         | UI-related events                  |
| `log.repository` | Repository operations              |

Enable in browser console:
```javascript
localStorage.debug = 'brizy:editor:ai:*'     // all channels
localStorage.debug = 'brizy:editor:ai:tools'  // tools only
```
