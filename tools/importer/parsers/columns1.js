/* global WebImporter */
export default function parse(element, { document }) {
  // Critical review adherence:
  // - Only one table needed (Columns block)
  // - Header must be 'Columns (columns1)'
  // - No Section Metadata table in example
  // - No hardcoded content; use direct references
  // - Only structure as in screenshot and markdown: a single row of two columns

  // Find the two main content blocks: the search UI, and the search button area
  // The button area is always .ai-search-button
  // The rest of the search options are in the sibling(s) before .ai-search-button

  // Get the search button area (right column)
  const searchButton = element.querySelector('.ai-search-button');

  // The left content is everything except the search button area
  // We'll create a wrapper div, and move all other children into it
  const leftWrapper = document.createElement('div');
  Array.from(element.children).forEach(child => {
    if (child !== searchButton) {
      leftWrapper.appendChild(child);
    }
  });

  // Edge case: if all content is missing, gracefully degrade
  const leftCell = leftWrapper.childNodes.length ? leftWrapper : document.createTextNode('');
  const rightCell = searchButton ? searchButton : document.createTextNode('');

  const cells = [
    ['Columns (columns1)'],
    [leftCell, rightCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}