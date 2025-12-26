
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Save, DraftingCompass, Calendar } from 'lucide-react';
import { BlogPost } from '../blog';

interface BlogEditorFormProps {
  title: string;
  content: string;
  imageUrl: string;
  originalStatus?: string;
  isDraftMode: boolean;
  isScheduledMode: boolean;
  loading: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onImageUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSaveDraft: () => void;
  onConvertToDraft: () => void;
  onSchedule: () => void;
  onCancel: () => void;
}

const BlogEditorForm: React.FC<BlogEditorFormProps> = ({
  title,
  content,
  imageUrl,
  originalStatus,
  isDraftMode,
  isScheduledMode,
  loading,
  onTitleChange,
  onContentChange,
  onImageUrlChange,
  onSubmit,
  onSaveDraft,
  onConvertToDraft,
  onSchedule,
  onCancel
}) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  // Determine which draft/convert button to show based on current state
  const shouldShowSaveDraft = isDraftMode || originalStatus === undefined;
  const shouldShowConvertToDraft = !isDraftMode && originalStatus && originalStatus !== 'draft';

  return (
    <Card className="allow-copy p-4 sm:p-6 bg-card dark:bg-card/60 border border-border/50 shadow-sm animate-fade-in">
      <form onSubmit={onSubmit} className="space-y-6">
        {isDraftMode && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <strong>Editing Draft:</strong> This post will be published when you click "Publish Post" and removed from your drafts.
          </div>
        )}

        {isScheduledMode && (
          <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
            <strong>Editing Scheduled Post:</strong> You can reschedule, publish now, or convert to draft.
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Blog Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter blog title"
            required
            className="w-full bg-background/5 dark:bg-card/50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium text-foreground">
            Blog Content
          </label>

          <div className="mb-6">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={onContentChange}
              modules={modules}
              formats={formats}
              className="custom-editor"
            />
            <style>
              {`
                .custom-editor {
                  height: 320px;
                  background-color: var(--card);
                  border-radius: 0.5rem;
                  overflow: hidden;
                }
                .custom-editor .ql-toolbar {
                  background-color: var(--card);
                  border-top-left-radius: 0.5rem;
                  border-top-right-radius: 0.5rem;
                  border: 1px solid var(--border);
                }
                .custom-editor .ql-container {
                  height: calc(320px - 42px);
                  background-color: var(--card);
                  border: 1px solid var(--border);
                  border-top: none;
                  border-bottom-left-radius: 0.5rem;
                  border-bottom-right-radius: 0.5rem;
                  font-family: inherit;
                }
              `}
            </style>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <label htmlFor="imageUrl" className="text-sm font-medium text-foreground">
              Optional Blog Image URL
            </label>
            {imageUrl && (
              <span className="text-sm font-medium text-[#7E69AB]">
                Image Preview
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-start">
            <Input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 bg-background/5 dark:bg-card/50"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full sm:w-32 h-20 object-cover rounded border shadow hover:scale-105 transition-transform"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {/* {shouldShowSaveDraft && ( */}
              {!shouldShowConvertToDraft && (
              <Button
                type="button"
                variant="outline"
                onClick={onSaveDraft}
                disabled={loading}
                className="border-border/50 text-foreground hover:bg-muted/5 text-sm"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>
            )}

            {shouldShowConvertToDraft && (
              <Button
                type="button"
                variant="outline"
                onClick={onConvertToDraft}
                disabled={loading}
                className="border-[#9b87f5] text-[#7E69AB] hover:bg-[#E5DEFF] text-sm"
              >
                <DraftingCompass className="h-4 w-4" />
                Convert to Draft
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={onSchedule}
              disabled={loading}
              className="border-border/50 text-foreground hover:bg-muted/5 text-sm"
            >
              <Calendar className="h-4 w-4" />
              {isScheduledMode ? 'Reschedule' : 'Schedule'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="border-border/50 text-foreground hover:bg-muted/5 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary/80 to-accent/70 text-white font-bold hover:shadow-md transition-all text-sm"
            >
              {loading ? 'Saving...' : isDraftMode ? 'Publish Post' : 'Update Post'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default BlogEditorForm;
