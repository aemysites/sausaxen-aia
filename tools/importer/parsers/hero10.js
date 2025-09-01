/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const headerRow = ['Hero (hero10)'];

  // Find the desktop banner image (preferred)
  let desktopImg = element.querySelector('img#mbbannerwithtxtdxtp');
  // Fallback to any img if the preferred is missing
  let img = desktopImg || element.querySelector('img');

  // Find the text content block
  let textContent = element.querySelector('.content .container-bs.internal_promo_image') || element.querySelector('.content');

  // Edge case: If no image, keep cell empty
  const imageCell = img || '';

  // Edge case: If no text, keep cell empty
  const textCell = textContent || '';

  // Construct table rows (no extra rows/cells, all content preserved, header matches example)
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  // Create table and replace
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
