import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// Define theme
monaco.editor.defineTheme("tempo-dark", {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#1e1e1e",
    "editor.foreground": "#d4d4d4",
    "editor.lineHighlightBackground": "#2a2a2a",
    "editor.selectionBackground": "#264f78",
    "editor.inactiveSelectionBackground": "#3a3d41",
  },
});

// Configure editor defaults
monaco.editor.getModels().forEach((model) => model.dispose());
monaco.editor.setTheme("tempo-dark");

export { monaco };
