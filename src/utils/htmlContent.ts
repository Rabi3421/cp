/**
 * Utility functions for handling HTML content
 */

/**
 * Strip HTML tags from a string
 * Useful for creating plain text previews from rich HTML content
 */
export function stripHtmlTags(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * Truncate HTML content to a specific length while preserving word boundaries
 * Strips HTML tags and creates a clean text preview
 */
export function truncateHtml(html: string, maxLength: number = 150): string {
  const plainText = stripHtmlTags(html)
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  // Find the last space before maxLength to avoid cutting words
  const truncated = plainText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...'
}

/**
 * Get the first paragraph from HTML content
 * Useful for creating excerpts
 */
export function getFirstParagraph(html: string): string {
  if (!html) return ''
  
  // Match the first <p> tag and its content
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i)
  return match ? stripHtmlTags(match[1]) : stripHtmlTags(html).split('\n')[0]
}

/**
 * Count words in HTML content
 */
export function countWords(html: string): number {
  const plainText = stripHtmlTags(html)
  return plainText.split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Estimate reading time in minutes
 * Average reading speed: 200 words per minute
 */
export function estimateReadingTime(html: string, wordsPerMinute: number = 200): number {
  const wordCount = countWords(html)
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Check if content has HTML formatting
 */
export function hasHtmlFormatting(content: string): boolean {
  if (!content) return false
  return /<[^>]*>/g.test(content)
}

/**
 * Sanitize HTML to prevent XSS (basic client-side check)
 * Note: Server-side sanitization should be the primary defense
 */
export function basicHtmlSanitize(html: string): string {
  if (!html) return ''
  
  // Remove script tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '')
  sanitized = sanitized.replace(/on\w+='[^']*'/gi, '')
  
  return sanitized
}

/**
 * Extract all headings from HTML content
 * Useful for creating a table of contents
 */
export function extractHeadings(html: string): Array<{ level: number; text: string }> {
  if (!html) return []
  
  const headings: Array<{ level: number; text: string }> = []
  const matches = html.matchAll(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi)
  
  for (const match of matches) {
    headings.push({
      level: parseInt(match[1]),
      text: stripHtmlTags(match[2])
    })
  }
  
  return headings
}
