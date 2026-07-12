import Editor from "@monaco-editor/react";

interface LuaEditorProps {
  script: string;
  onChange: (value: string) => void;
}

export function LuaEditor({ script, onChange }: LuaEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="lua"
      value={script}
      onChange={(v) => onChange(v ?? "")}
      theme="vs-dark"
      options={{
        fontSize: 13,
        minimap: { enabled: false },
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        wordWrap: "on",
      }}
    />
  );
}
