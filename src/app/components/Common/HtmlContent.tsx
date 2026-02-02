import React from 'react'

interface HtmlContentProps {
  content: string
  className?: string
}

/**
 * A component to safely render HTML content with SEO-friendly markup
 * This component uses dangerouslySetInnerHTML which is safe when content
 * is sanitized on the server side before storage
 */
export default function HtmlContent({ content, className = '' }: HtmlContentProps) {
  if (!content) {
    return null
  }

  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
