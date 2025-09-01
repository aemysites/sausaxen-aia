/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child by class
  function getChild(cls) {
    return Array.from(element.children).find(e => e.classList.contains(cls));
  }

  // Get main wrappers
  const originDest = getChild('ai-origin-dest-search');
  const trip = getChild('ai-search-trip');
  const button = getChild('ai-search-button');

  // Defensive: null fallback
  const leftCol1 = originDest || '';
  // For rightCol1: we want just the trip type selection (radio and link)
  let rightCol1 = '';
  if (trip) {
    const tripType = trip.querySelector('.ai-search-trip-type');
    rightCol1 = tripType ? tripType : '';
  }

  // Second row: left = rest of trip (dates, pax, class, pay), right = button
  let leftCol2 = '';
  if (trip) {
    // Clone trip to avoid mutating DOM
    const tripClone = trip.cloneNode(true);
    // Remove trip type selection from the clone
    const toRemove = tripClone.querySelector('.ai-search-trip-type');
    if (toRemove) toRemove.remove();
    leftCol2 = tripClone;
  }
  const rightCol2 = button || '';

  // Build cells: header, row1, row2
  const headerRow = ['Columns (columns1)'];
  const row1 = [leftCol1, rightCol1];
  const row2 = [leftCol2, rightCol2];

  const cells = [headerRow, row1, row2];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
