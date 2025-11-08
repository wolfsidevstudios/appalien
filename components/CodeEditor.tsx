import React from 'react';

interface CodeEditorProps {
  code: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code }) => {
  return (
    <div className="flex flex-col bg-gray-950 h-full p-4">
      <div className="flex-1 overflow-auto bg-gray-900 rounded-lg border border-gray-800 p-4">
        <pre className="text-sm font-mono whitespace-pre-wrap"><code className="language-html">{code}</code></pre>
      </div>
    </div>
  );
};