'use client';

import { Editor } from "novel-lightweight";
import { useEffect, useState } from 'react';

export function MarkdownEditor({ content, onChange }) {
  const [data, setData] = useState(content || "");

  // Update data when content prop changes
  useEffect(() => {
    if (content !== undefined) {
      setData(content);
    }
  }, [content]);

  return (
    <div className="w-full h-full min-h-[500px]">
      <Editor
        defaultValue={data}
        value={data}
        disableLocalStorage={true}
        onUpdate={({ editor }) => {
          if (editor) {
            const markdown = editor.storage.markdown.getMarkdown();
            setData(markdown);
            onChange(markdown);
          }
        }}
        className="h-full min-h-[500px] border rounded-lg"
      />
    </div>
  );
}
