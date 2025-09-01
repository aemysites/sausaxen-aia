/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container with the first set of columns
  // This is the first .container.responsivegrid.container-bs with a .cmp-container > .aem-Grid containing .footerComponent
  const mainContainers = element.querySelectorAll('.container.responsivegrid.container-bs');
  let mainGrid = null;
  for (const c of mainContainers) {
    const cmp = c.querySelector(':scope > .cmp-container');
    if (cmp) {
      const grid = cmp.querySelector(':scope > .aem-Grid');
      if (grid && grid.querySelector('.footerComponent')) {
        mainGrid = grid;
        break;
      }
    }
  }
  if (!mainGrid) return;

  // Get the first 3 footerComponent columns for the Columns block
  const columnEls = Array.from(mainGrid.children)
    .filter(el => el.classList.contains('footerComponent'))
    .slice(0, 3);

  // Helper to extract all content from a .footerComponent for the cell
  function getColumnCellContent(component) {
    // We want to reference the content block inside the accordion body, but include the heading as plain text
    const accordion = component.querySelector('.accordion');
    let heading = '';
    // Try to get heading from button, fallback to header text
    const button = accordion && accordion.querySelector('.accordion-header button');
    if (button) {
      heading = button.textContent.trim();
    } else if (accordion) {
      const header = accordion.querySelector('.accordion-header');
      if (header) heading = header.textContent.trim();
    }
    // Get the .accordion-body content
    let contentFragment = document.createDocumentFragment();
    const body = accordion && accordion.querySelector('.accordion-body');
    if (body) {
      // Append all children (preserves lists, text, links, etc)
      Array.from(body.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          contentFragment.appendChild(node);
        }
      });
    }
    // Compose the cell: heading + content
    const container = document.createElement('div');
    if (heading) {
      const headingText = document.createElement('div');
      headingText.textContent = heading;
      container.appendChild(headingText);
    }
    container.appendChild(contentFragment);
    // Return the reference to the container element, which now holds all text, lists, and links
    return container;
  }

  // Prepare the table rows
  const headerRow = ['Columns (columns3)'];
  const colsRow = columnEls.map(getColumnCellContent);
  const cells = [headerRow, colsRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
