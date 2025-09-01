/* global WebImporter */
export default function parse(element, { document }) {
  // Block header: Must be exactly 'Hero (hero9)'
  const headerRow = ['Hero (hero9)'];

  // --- BACKGROUND IMAGE (Row 2) ---
  // Get first relevant image. If none, provide null cell.
  let bgImg = null;
  const imgs = element.querySelectorAll('img');
  if (imgs.length > 0) {
    // Use first image only (desktop preferred, seems to come first)
    bgImg = imgs[0];
  }

  // --- TEXT CONTENT (Row 3) ---
  // Find the main text content container, or fallback gracefully
  let textContent = null;
  const contentBlock = element.querySelector('.content .container-bs, .content .container-bs.internal_promo_image');
  if (contentBlock) {
    // Use the entire content block, so structure is preserved (headings, paragraphs, etc.)
    textContent = contentBlock;
  } else {
    // fallback: gather all text elements under .content if .container-bs not present
    const genericContent = element.querySelector('.content');
    if (genericContent) {
      textContent = genericContent;
    }
  }
  // If still not found, leave cell blank (null)

  // Compose the table
  const cells = [
    headerRow,
    [bgImg],
    [textContent]
  ];

  // Create and inject the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
