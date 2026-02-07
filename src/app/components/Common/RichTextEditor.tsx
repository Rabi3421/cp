'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'quill/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => (
    <div className='w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl flex items-center justify-center' style={{ height: '300px' }}>
      <div className='text-gray-400'>Loading editor...</div>
    </div>
  )
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  height?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content...',
  label,
  height = '300px',
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Quill modules configuration for SEO-friendly HTML
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  }

  const formats = [
    'header',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'indent',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className='rich-text-editor'>
      {label && (
        <label className='block text-sm font-medium text-black dark:text-white mb-2'>
          {label}
        </label>
      )}
      <div className='quill-wrapper'>
        <ReactQuill
          theme='snow'
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ height }}
        />
      </div>
      <style jsx global>{`
        .rich-text-editor .quill-wrapper {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .dark .rich-text-editor .quill-wrapper {
          background: #030712;
          border-color: #1f2937;
        }

        .rich-text-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 12px;
        }

        .dark .rich-text-editor .ql-toolbar {
          background: #111827;
          border-color: #1f2937;
        }

        .rich-text-editor .ql-container {
          border: none;
          font-size: 16px;
          font-family: inherit;
        }

        .rich-text-editor .ql-editor {
          min-height: ${height};
          padding: 16px;
          color: #000;
        }

        .dark .rich-text-editor .ql-editor {
          color: #fff;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }

        /* Toolbar button styles */
        .rich-text-editor .ql-toolbar button {
          width: 32px;
          height: 32px;
          padding: 4px;
        }

        .rich-text-editor .ql-toolbar button:hover {
          background: #e5e7eb;
          border-radius: 4px;
        }

        .dark .rich-text-editor .ql-toolbar button:hover {
          background: #1f2937;
        }

        .rich-text-editor .ql-toolbar button.ql-active {
          background: #dbeafe;
          border-radius: 4px;
        }

        .dark .rich-text-editor .ql-toolbar button.ql-active {
          background: #1e3a8a;
        }

        /* Icon colors */
        .rich-text-editor .ql-stroke {
          stroke: #374151;
        }

        .dark .rich-text-editor .ql-stroke {
          stroke: #d1d5db;
        }

        .rich-text-editor .ql-fill {
          fill: #374151;
        }

        .dark .rich-text-editor .ql-fill {
          fill: #d1d5db;
        }

        .rich-text-editor .ql-picker-label {
          color: #374151;
        }

        .dark .rich-text-editor .ql-picker-label {
          color: #d1d5db;
        }

        /* Dropdown styles */
        .rich-text-editor .ql-picker-options {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 4px;
        }

        .dark .rich-text-editor .ql-picker-options {
          background: #1f2937;
          border-color: #374151;
        }

        .rich-text-editor .ql-picker-item {
          color: #000;
        }

        .dark .rich-text-editor .ql-picker-item {
          color: #fff;
        }

        /* Content formatting for SEO */
        .rich-text-editor .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          line-height: 1.2;
        }

        .rich-text-editor .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
          line-height: 1.3;
        }

        .rich-text-editor .ql-editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
          line-height: 1.4;
        }

        .rich-text-editor .ql-editor p {
          margin: 1em 0;
          line-height: 1.6;
        }

        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }

        .rich-text-editor .ql-editor li {
          margin: 0.5em 0;
          line-height: 1.6;
        }

        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 16px;
          margin: 1em 0;
          font-style: italic;
          color: #6b7280;
        }

        .dark .rich-text-editor .ql-editor blockquote {
          color: #9ca3af;
        }

        .rich-text-editor .ql-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }

        .rich-text-editor .ql-editor code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Courier New', monospace;
        }

        .dark .rich-text-editor .ql-editor code {
          background: #1f2937;
        }

        .rich-text-editor .ql-editor pre {
          background: #f3f4f6;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
        }

        .dark .rich-text-editor .ql-editor pre {
          background: #1f2937;
        }
      `}</style>
    </div>
  )
}
