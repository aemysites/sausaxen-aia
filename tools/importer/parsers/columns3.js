/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all columns from a grid structure
  function getGridColumns(grid) {
    const cols = [];
    // Only direct children that are .footerComponent
    Array.from(grid.children).forEach(col => {
      if (col.classList.contains('footerComponent')) {
        // For main links columns, get the full accordion
        const accordion = col.querySelector('.accordion');
        if (accordion) {
          cols.push(accordion);
        } else {
          cols.push(col);
        }
      }
    });
    return cols;
  }

  // Helper to get CustomImage blocks
  function getCustomImages(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll('.CustomImage'));
  }

  // Helper to get text blocks
  function getTextBlocks(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll('.cmp-text'));
  }

  // Build header
  const cells = [['Columns (columns3)']];

  // Get all .container.responsivegrid.container-bs (content rows)
  const gridWrappers = Array.from(element.querySelectorAll('.container.responsivegrid.container-bs'));

  // First group: main navigation columns (About Us, Book & Manage, Where We Fly, Prepare to Travel)
  if (gridWrappers[0]) {
    const grid = gridWrappers[0].querySelector('.aem-Grid');
    if (grid) {
      const cols = getGridColumns(grid);
      if (cols.length) cells.push(cols);
    }
  }

  // Second group: Experience, Loyalty, Support, App
  if (gridWrappers[1]) {
    const grid = gridWrappers[1].querySelector('.aem-Grid');
    if (grid) {
      const cols = getGridColumns(grid);
      if (cols.length) cells.push(cols);
    }
  }

  // Third group: Legal, Social
  if (gridWrappers[2]) {
    const grid = gridWrappers[2].querySelector('.aem-Grid');
    if (grid) {
      const cols = getGridColumns(grid);
      if (cols.length) cells.push(cols);
    }
  }

  // Tata logo row
  const tataSection = element.querySelector('#tatasection');
  const tataLogos = getCustomImages(tataSection);
  if (tataLogos.length) {
    cells.push(tataLogos);
  }

  // Air India & Star Alliance logo row
  const copyrightGrid = element.querySelector('#copyright .aem-Grid');
  const footerRight = copyrightGrid ? copyrightGrid.querySelector('#footer_right') : null;
  const logoRow = getCustomImages(footerRight);
  if (logoRow.length) {
    cells.push(logoRow);
  }

  // Copyright text row
  const copytextWrap = element.querySelector('#copytext');
  let copyrightTexts = [];
  if (copytextWrap) {
    copyrightTexts = getTextBlocks(copytextWrap);
  }
  if (copyrightTexts.length) {
    cells.push(copyrightTexts);
  }

  // Replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
