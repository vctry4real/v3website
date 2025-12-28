import React, { useState, useCallback, useRef } from 'react';
import {
  Eye, EyeOff, Upload, Image as ImageIcon, Link as LinkIcon,
  Bold, Italic, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, SeparatorHorizontal
} from 'lucide-react';
import { Button } from './Button';
import { ImageUploadService } from '../lib/imageUploadService';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Helper: ensure a block insertion (like a heading) starts at beginning of a line
function insertBlockAtCursor(current: string, cursorStart: number, cursorEnd: number, block: string) {
  // Determine if we're at line start
  const before = current.slice(0, cursorStart);
  const after = current.slice(cursorEnd);
  const atLineStart = before.endsWith('\n') || before.length === 0;

  // Ensure blank line before and after block
  const prefix = atLineStart ? '' : '\n';
  const needsBlankBefore = !before.endsWith('\n\n') && before.length > 0 ? '\n' : '';
  const suffix = after.startsWith('\n') ? '\n' : '\n\n';

  const insertion = `${needsBlankBefore}${prefix}${block}${suffix}`;
  const newValue = before + insertion + after;

  const newCursor = (before + insertion).length;
  return { newValue, newCursor };
}

// Helper: inline insertion (bold/italic/code)
function insertInlineAtSelection(current: string, start: number, end: number, template: (selected: string) => string) {
  const before = current.slice(0, start);
  const selected = current.slice(start, end);
  const after = current.slice(end);
  const insertion = template(selected || 'TEXT');
  const newValue = before + insertion + after;
  const newCursor = (before + insertion).length;
  return { newValue, newCursor };
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your markdown content here...',
  className = '',
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- Image upload ---
  const uploadImage = useCallback(async (file: File) => {
    if (!file) return;
    const loadingToast = toast.loading('Uploading image...');
    try {
      const result = await ImageUploadService.uploadImage(file, false);
      toast.dismiss(loadingToast);
      if (result.success) {
        const imageMarkdown = `![${file.name}](${result.url})`;
        const cursorPosition = textareaRef.current?.selectionStart ?? value.length;
        const currentValue = value;
        const newValue = currentValue.slice(0, cursorPosition) + imageMarkdown + currentValue.slice(cursorPosition);
        onChange(newValue);
        toast.success('Image added successfully!');
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Image upload failed:', err);
      toast.error('Failed to upload image');
    }
  }, [onChange, value]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) uploadImage(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [uploadImage]);

  // --- Insertion handlers ---
  const handleInsertInline = useCallback((template: (sel: string) => string, successMsg?: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const { selectionStart, selectionEnd } = ta;
    const { newValue, newCursor } = insertInlineAtSelection(value, selectionStart, selectionEnd, template);
    onChange(newValue);

    // restore cursor
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(newCursor, newCursor);
    });

    if (successMsg) toast.success(successMsg);
  }, [onChange, value]);

  const handleInsertBlock = useCallback((block: string, successMsg?: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const { selectionStart, selectionEnd } = ta;
    const { newValue, newCursor } = insertBlockAtCursor(value, selectionStart, selectionEnd, block);
    onChange(newValue);

    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(newCursor, newCursor);
    });

    if (successMsg) toast.success(successMsg);
  }, [onChange, value]);

  // Convenience wrappers
  const insertBold = () => handleInsertInline(sel => `**${sel}**`, 'Bold text inserted');
  const insertItalic = () => handleInsertInline(sel => `*${sel}*`, 'Italic text inserted');
  const insertCodeInline = () => handleInsertInline(sel => `\`${sel}\``, 'Code inserted');

  const insertH1 = () => handleInsertBlock(`# ${''}`, 'Heading 1 inserted');
  const insertH2 = () => handleInsertBlock(`## ${''}`, 'Heading 2 inserted');
  const insertH3 = () => handleInsertBlock(`### ${''}`, 'Heading 3 inserted');

  const insertBullet = () => handleInsertBlock(`- `, 'Bullet list item inserted');
  const insertOrdered = () => handleInsertBlock(`1. `, 'Numbered list item inserted');
  const insertQuote = () => handleInsertBlock(`> `, 'Quote inserted');
  const insertHR = () => handleInsertBlock(`---`, 'Horizontal rule inserted');

  const insertLinkTemplate = () => handleInsertInline(sel => `[${sel}](URL)`, 'Link template inserted');
  const insertImageTemplate = () => handleInsertInline(sel => `![${sel || 'ALT'}](URL)`, 'Image template inserted');

  // --- Preview toggle ---
  const handlePreviewToggle = useCallback(() => setShowPreview(p => !p), []);

  // Toolbar button
  const ToolbarButton = ({
    onClick, icon: Icon, title,
  }: {
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="p-2 h-8 w-8"
      title={title}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  return (
    <div className={`border border-border-muted rounded-lg bg-surface-muted ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border-muted bg-surface-elevated rounded-t-lg">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={insertBold} icon={Bold} title="Bold" />
          <ToolbarButton onClick={insertItalic} icon={Italic} title="Italic" />
          <ToolbarButton onClick={insertCodeInline} icon={Code} title="Inline Code" />
        </div>

        <div className="w-px h-6 bg-border-muted mx-1" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={insertH1} icon={Heading1} title="Heading 1" />
          <ToolbarButton onClick={insertH2} icon={Heading2} title="Heading 2" />
          <ToolbarButton onClick={insertH3} icon={Heading3} title="Heading 3" />
        </div>

        <div className="w-px h-6 bg-border-muted mx-1" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={insertBullet} icon={List} title="Bullet List" />
          <ToolbarButton onClick={insertOrdered} icon={ListOrdered} title="Numbered List" />
        </div>

        <div className="w-px h-6 bg-border-muted mx-1" />

        {/* Links & Images */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={insertLinkTemplate} icon={LinkIcon} title="Add Link" />
          <ToolbarButton onClick={insertImageTemplate} icon={ImageIcon} title="Add Image URL" />
          <ToolbarButton onClick={() => fileInputRef.current?.click()} icon={Upload} title="Upload Image" />
        </div>

        <div className="w-px h-6 bg-border-muted mx-1" />

        {/* Block Elements */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={insertQuote} icon={Quote} title="Quote" />
          <ToolbarButton onClick={insertHR} icon={SeparatorHorizontal} title="Horizontal Rule" />
        </div>

        <div className="flex-1" />

        {/* Preview Toggle */}
        <ToolbarButton onClick={handlePreviewToggle} icon={showPreview ? EyeOff : Eye} title={showPreview ? 'Hide Preview' : 'Show Preview'} />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Editor / Preview */}
      <div className="flex">
        {/* Editor */}
        <div className={`flex-1 ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[300px] max-h-[600px] p-4 bg-surface-muted text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <>
            <div className="w-px bg-border-muted" />
            <div className="w-1/2 p-4 overflow-y-auto max-h-[600px]">
              {/* Typography for nice defaults */}
              <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed
                           prose-headings:text-text prose-a:text-primary prose-strong:text-text
                           prose-code:text-primary-hover prose-pre:bg-surface-elevated prose-pre:border prose-pre:border-border-muted
                           prose-p:text-base sm:text-lg prose-li:text-base sm:text-lg prose-img:rounded-lg">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    // Custom components to handle specific cases
                    a: ({ href, children, ...props }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-hover underline"
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    img: ({ src, alt, ...props }) => (
                      <img
                        src={src}
                        alt={alt}
                        className="max-w-full h-auto rounded-lg"
                        {...props}
                      />
                    ),
                  }}
                >
                  {value}
                </ReactMarkdown>
              </article>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
