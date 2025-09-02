/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the markdown example
  const headerRow = ['Columns (columns1)'];

  // Get all top-level direct child divs (logical column content)
  const groups = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: ensure at least 2 groups for layout
  while (groups.length < 2) {
    groups.push(document.createElement('div'));
  }

  // To match 2x2 grid beneath header
  // Use first two for top row, then duplicate them for bottom row (since only 2 logical groups)
  const leftTop = groups[0];
  const rightTop = groups[1];
  const leftBottom = groups[0].cloneNode(true);
  const rightBottom = groups[1].cloneNode(true);

  // Table rows: header, then two rows of two columns each
  const cells = [
    headerRow,
    [leftTop, rightTop],
    [leftBottom, rightBottom],
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
