/**
 * Extract series slug from various formats
 * Handles both full URLs and plain slugs
 */
export function extractSeriesSlug(input: string): string {
  if (!input) return '';
  
  // If it's a URL, extract the slug from it
  if (input.includes('://') || input.includes('www.')) {
    try {
      // First, try to fix malformed URLs like https://www.manhwaindo.mynano-machine
      // by adding a / before the slug part
      let fixedInput = input;
      const malformedMatch = input.match(/^(https?:\/\/www\.manhwaindo\.my)([a-zA-Z0-9\-]+)$/);
      if (malformedMatch) {
        fixedInput = `${malformedMatch[1]}/${malformedMatch[2]}`;
      }
      
      const url = new URL(fixedInput);
      const pathname = url.pathname;
      
      // Extract slug from paths like /series/solo-leveling/ or /series/solo-leveling or /nano-machine
      const match = pathname.match(/\/series\/([^\/]+)/);
      if (match && match[1]) {
        return match[1];
      }
      
      // Fallback: get last non-empty path segment
      const segments = pathname.split('/').filter(s => s);
      if (segments.length > 0) {
        return segments[segments.length - 1];
      }
    } catch (e) {
      // If URL parsing fails, try to extract manually
      const match = input.match(/\/series\/([^\/]+)/);
      if (match && match[1]) {
        return match[1];
      }
      
      // Handle malformed domain-based slug (e.g., www.manhwaindo.mynano-machine -> nano-machine)
      const domainMatch = input.match(/www\.manhwaindo\.my([a-zA-Z0-9\-]+)/);
      if (domainMatch && domainMatch[1]) {
        return domainMatch[1];
      }
    }
  }
  
  // If it's already a plain slug, return it as-is
  return input;
}

/**
 * Clean and normalize a slug
 */
export function cleanSlug(slug: string): string {
  return slug.replace(/\/+$/, '').trim();
}

/**
 * Encode slug for URL usage
 */
export function encodeSlug(slug: string): string {
  return encodeURIComponent(cleanSlug(slug));
}
