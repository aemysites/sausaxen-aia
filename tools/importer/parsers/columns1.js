/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as per example
  const headerRow = ['Columns (columns1)'];

  // 2. Get the key content areas, mapping to two logical rows of columns
  // First logical row: main search form (left), promo/search button (right)
  // Second logical row: nothing else present in this HTML, so we leave these cells empty

  // Get children
  const mainChildren = Array.from(element.children);
  // Right column: .ai-search-button
  const rightCol1 = element.querySelector('.ai-search-button');
  // Left column: everything else
  const leftCol1 = document.createElement('div');
  mainChildren.forEach(child => {
    if (!child.classList.contains('ai-search-button')) {
      leftCol1.appendChild(child);
    }
  });
  // Second row: both columns empty (no images or preview content in this HTML)
  const leftCol2 = '';
  const rightCol2 = '';

  // 3. Assemble cells
  const cells = [
    headerRow,
    [leftCol1, rightCol1],
    [leftCol2, rightCol2]
  ];

  // 4. Replace original with the structured table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
