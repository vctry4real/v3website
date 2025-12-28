import React, { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { MarkdownEditor } from './MarkdownEditor';
import { Button } from './Button';
import { Type, FileText } from 'lucide-react';

export const EditorDemo: React.FC = () => {
  const [richTextContent, setRichTextContent] = useState('<h1>Welcome to the Rich Text Editor!</h1><p>This is a <strong>powerful</strong> editor with <em>rich formatting</em> capabilities.</p><p>You can:</p><ul><li>Format text with <strong>bold</strong>, <em>italic</em>, and <u>underline</u></li><li>Add headings (H1, H2, H3)</li><li>Create lists (bullet and numbered)</li><li>Align text (left, center, right)</li><li>Add code blocks and inline code</li><li>Insert quotes and horizontal rules</li><li>Add links and images</li></ul>');

  const [markdownContent, setMarkdownContent] = useState(`# Welcome to the Markdown Editor!

This is a **powerful** markdown editor with *rich formatting* capabilities.

## Features

You can:
- Format text with **bold**, *italic*, and \`code\`
- Add headings (# H1, ## H2, ### H3)
- Create lists (bullet and numbered)
- Add [links](https://example.com) and images
- Insert quotes and horizontal rules
- Preview your content in real-time

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> This is a blockquote example.

---

**Try editing this content to see the editors in action!**`);

  const [showDemo, setShowDemo] = useState(false);

  if (!showDemo) {
    return (
      <div className="text-center py-8">
        <Button onClick={() => setShowDemo(true)}>
          View Rich Text Editor Demo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text">Rich Text Editor Demo</h2>
        <Button variant="outline" onClick={() => setShowDemo(false)}>
          Close Demo
        </Button>
      </div>

      {/* Rich Text Editor Demo */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Type className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-text">Rich Text Editor</h3>
        </div>
        <RichTextEditor
          value={richTextContent}
          onChange={setRichTextContent}
          placeholder="Start typing your rich content here..."
        />
        <div className="bg-surface-elevated p-4 rounded-lg">
          <h4 className="text-sm font-medium text-text-secondary mb-2">HTML Output:</h4>
          <pre className="text-xs text-text-muted overflow-x-auto whitespace-pre-wrap">
            {richTextContent}
          </pre>
        </div>
      </div>

      {/* Markdown Editor Demo */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-success" />
          <h3 className="text-lg font-semibold text-text">Markdown Editor</h3>
        </div>
        <MarkdownEditor
          value={markdownContent}
          onChange={setMarkdownContent}
          placeholder="Start typing your markdown content here..."
        />
        <div className="bg-surface-elevated p-4 rounded-lg">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Markdown Output:</h4>
          <pre className="text-xs text-text-muted overflow-x-auto whitespace-pre-wrap">
            {markdownContent}
          </pre>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-surface-elevated p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-text mb-4">Editor Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-primary mb-2">Rich Text Editor</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• WYSIWYG editing experience</li>
              <li>• Real-time formatting toolbar</li>
              <li>• Image upload and embedding</li>
              <li>• Link insertion and management</li>
              <li>• Text alignment options</li>
              <li>• Code blocks and inline code</li>
              <li>• Blockquotes and horizontal rules</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-success mb-2">Markdown Editor</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Markdown syntax support</li>
              <li>• Real-time preview</li>
              <li>• Quick formatting buttons</li>
              <li>• Image upload with markdown syntax</li>
              <li>• Split-screen editing</li>
              <li>• Syntax highlighting</li>
              <li>• Export to HTML</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
