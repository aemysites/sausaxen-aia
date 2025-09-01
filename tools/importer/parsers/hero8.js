/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Hero (hero8)'];

  // Background image: prefer desktop, fallback to mobile
  let bgImg = element.querySelector('img.card-img-top.main-img');
  if (!bgImg) bgImg = element.querySelector('img.main-img-mobile');
  const bgImgRow = [bgImg ? bgImg : ''];

  // Content row: capture all text and CTA link
  // Find the best text container (overlay area)
  let overlay = element.querySelector('.card-img-overlay .text-left') ||
                element.querySelector('.card-img-overlay') ||
                element.querySelector('.container-bs');

  let contentElems = [];
  if (overlay) {
    // Collect all block-level elements in overlay except images
    const blocks = Array.from(overlay.childNodes).filter((node) => {
      // Only element nodes (not text nodes)
      if (node.nodeType !== 1) return false;
      // Exclude images
      if (node.tagName.toLowerCase() === 'img') return false;
      // Exclude empty paragraphs
      if (node.tagName.toLowerCase() === 'p' && !node.textContent.trim()) return false;
      return true;
    });
    // Pull in all blocks, including spans, paragraphs, headings, links, etc.
    contentElems = blocks.length ? blocks : [''];
  } else {
    contentElems = [''];
  }

  const contentRow = [contentElems];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
