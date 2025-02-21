'use client';

import { Editor } from "novel-lightweight";
import { useEffect, useState, useCallback } from 'react';

export function MarkdownEditor({ content, onChange, readOnly = false }) {
  const [editorContent, setEditorContent] = useState(content || "");

  // Update local state when content prop changes
  useEffect(() => {
    if (content !== undefined && content !== editorContent) {
      setEditorContent(content);
    }
  }, [content]);

  // Handle editor updates
  const handleUpdate = useCallback((editor) => {
    if (editor) {
      const markdown = editor.storage.markdown.getMarkdown();
      setEditorContent(markdown);
      onChange?.(markdown);
    }
  }, [onChange]);

  return (
    <div className="w-full h-full overflow-auto min-h-[500px]">
      <Editor
        defaultValue={editorContent}
        disableLocalStorage={true}
        value={editorContent}
        onUpdate={handleUpdate}
        handleImageUpload={async (file) => {
          try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || 'Failed to upload image');
            }

            return data.url;
          } catch (error) {
            console.error('Image upload error:', error);
            return null;
          }
        }}
  
        editable={!readOnly}
        className="h-full min-h-[500px]   rounded-lg border-0"
      />
    </div>
  );
}
