/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name as specified in the example
  const headerRow = ['Hero (hero8)'];

  // 2. Image row: get main desktop image (prefer card-img-top), fallback to mobile image
  let bgImg = element.querySelector('img.card-img-top.main-img.child') || element.querySelector('img.main-img-mobile');
  const imageRow = [bgImg || '']; // always a single cell

  // 3. Content row: all text and CTA, in source order and preserving semantic meaning
  const overlay = element.querySelector('.card-img-overlay');
  let contentItems = [];

  if (overlay) {
    // Find text container (if any)
    const textContainer = overlay.querySelector('.text-left') || overlay;
    // Collect:
    // - Any banner heading (span/banner-left-heading)
    const heading = textContainer.querySelector('.banner-left-heading');
    if (heading && heading.textContent.trim()) {
      const h1 = document.createElement('h1');
      h1.textContent = heading.textContent.trim();
      contentItems.push(h1);
    }
    // - Any description (p.banner-left-description)
    const desc = textContainer.querySelector('p.banner-left-description');
    if (desc) {
      // Keep the original paragraph element to preserve potential formatting
      contentItems.push(desc);
    }
    // - Any CTA/link (a.learn-more-button, a#cardBannerLink)
    const cta = textContainer.querySelector('a.learn-more-button, a#cardBannerLink');
    if (cta) {
      // Remove screen-reader-only span for clean output
      const sr = cta.querySelector('.cmp-link__screen-reader-only');
      if (sr) sr.remove();
      contentItems.push(cta);
    }
  }

  // If nothing found in overlay, fallback: collect all visible headings, paragraphs and links in element
  if (contentItems.length === 0) {
    // Use all headings, paragraphs, spans, and links at any level
    const fallbackNodes = element.querySelectorAll('h1, h2, h3, h4, h5, h6, span, p, a');
    fallbackNodes.forEach(node => {
      if (node.tagName === 'A') {
        const sr = node.querySelector('.cmp-link__screen-reader-only');
        if (sr) sr.remove();
      }
      if ((node.textContent && node.textContent.trim()) || node.tagName === 'A') {
        contentItems.push(node);
      }
    });
  }

  // Always supply at least an empty string if no content found (avoid empty cell)
  const contentRow = [contentItems.length > 0 ? contentItems : ['']];

  // Assemble the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table block
  element.replaceWith(block);
}
