/* global WebImporter */
export default function parse(element, { document }) {
  // The block table should have two columns in the content row:
  // Left: all controls (origin/dest, trip, button, etc.)
  // Right: all media (images, video, iframe as link)
  const headerRow = ['Columns (columns1)'];

  // --- LEFT COLUMN: All controls/fields/buttons ---
  // Collect the key control blocks and reference them in DOM order
  const leftOrder = [
    '.ai-origin-dest-search',
    '.ai-search-trip',
    '.ai-search-button'
  ];
  const leftElements = [];
  leftOrder.forEach(selector => {
    const el = element.querySelector(selector);
    if (el) leftElements.push(el);
  });
  // Fallback: if nothing found, fallback to the whole element.
  const leftCell = leftElements.length === 1 ? leftElements[0] : leftElements;

  // --- RIGHT COLUMN: All media (img, video, iframes as link) ---
  const rightElements = [];
  element.querySelectorAll('img').forEach(img => rightElements.push(img));
  element.querySelectorAll('video').forEach(video => rightElements.push(video));
  element.querySelectorAll('iframe').forEach(iframe => {
    if (iframe.src) {
      const a = document.createElement('a');
      a.href = iframe.src;
      a.textContent = iframe.src;
      rightElements.push(a);
    }
  });
  // If no media, leave cell empty
  const rightCell = rightElements.length === 1 ? rightElements[0] : rightElements;

  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
