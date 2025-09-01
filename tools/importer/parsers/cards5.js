/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must match the example: one column, block name only
  const cells = [['Cards (cards5)']];

  // Select all card elements
  const cardCols = element.querySelectorAll('.row.row-cols-1.row-cols-md-3.row-cols-lg-4.g-4 > .col');
  cardCols.forEach((col) => {
    const anchor = col.querySelector('.partner_card > a');
    if (!anchor) return;
    const img = anchor.querySelector('img');
    // Compose text content: title and possible description
    const cardBody = anchor.querySelector('.partner_card_body');
    const textFragments = [];
    if (cardBody) {
      // Title
      const titleDiv = cardBody.querySelector('.partner_title');
      if (titleDiv && titleDiv.textContent.trim()) {
        const titleEl = document.createElement('strong');
        titleEl.textContent = titleDiv.textContent.trim();
        textFragments.push(titleEl);
      }
      // If there is other descriptive content, add it (for flexibility)
      Array.from(cardBody.children).forEach((child) => {
        if (
          child !== titleDiv &&
          child.textContent &&
          child.textContent.trim()
        ) {
          const descP = document.createElement('p');
          descP.textContent = child.textContent.trim();
          textFragments.push(descP);
        }
      });
    }
    // Each row after header must have two columns: [img, text]
    cells.push([img, textFragments.length ? textFragments : '']);
  });

  // Create and replace the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
