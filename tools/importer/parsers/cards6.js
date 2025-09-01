/* global WebImporter */
export default function parse(element, { document }) {
  // Create the block header row exactly matching the example
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Find the card grid container
  const cardGrid = element.querySelector('.row.row-cols-1.row-cols-md-3.row-cols-lg-4.g-4');
  if (!cardGrid) return;

  // Each card: get all immediate children with class .col
  const cardEls = cardGrid.querySelectorAll(':scope > .col');
  cardEls.forEach(col => {
    // Image: first image within .img-area (if any)
    const img = col.querySelector('.img-area img');

    // Text Content: get .partner_card_body if present
    const cardBody = col.querySelector('.partner_card_body');
    let textCell;
    if (cardBody) {
      // Make a container for text content
      const fragment = document.createDocumentFragment();
      // Title: .partner_title (if present)
      const title = cardBody.querySelector('.partner_title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        fragment.appendChild(strong);
      }
      // If there is any other content (description, etc), append it below
      // In this HTML, only .partner_title is present as child of cardBody, so just handle that
      textCell = fragment.childNodes.length ? fragment : '';
    } else {
      textCell = '';
    }
    // Add the card row (always both cells, never empty cell)
    rows.push([img || '', textCell]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
