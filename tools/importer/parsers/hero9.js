/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as specified
  const headerRow = ['Hero (hero9)'];

  // Find the main background image: prefer desktop, but fallback to first img if needed
  const bannerDiv = element.querySelector('.banner');
  let bgImg = null;
  if (bannerDiv) {
    // Try to find desktop first, else first img
    const imgs = bannerDiv.querySelectorAll('img');
    if (imgs.length) {
      // Prefer the desktop banner (first image), fallback if not present
      bgImg = imgs[0];
    }
  }
  // Row for the background image
  const bgRow = [bgImg ? bgImg : ''];

  // Find content elements (headline, etc.)
  let contentElements = [];
  const contentContainer = element.querySelector('.content .container-bs.internal_promo_image');
  if (contentContainer) {
    // Filter out paragraphs that are just &nbsp; or whitespace
    const nonEmptyChildren = Array.from(contentContainer.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'P') {
          // If only &nbsp; or whitespace, skip
          return node.textContent.replace(/\u00a0/g, '').trim().length > 0;
        }
        return true;
      }
      return false; // Skip text nodes and others
    });
    contentElements = nonEmptyChildren;
  }
  const contentRow = [contentElements.length ? contentElements : ''];

  // Build and replace with the table
  const cells = [
    headerRow,
    bgRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
