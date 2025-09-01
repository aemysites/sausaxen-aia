/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name as in the example
  const rows = [['Cards (cards5)']];

  // Locate all card grid columns
  const cardsContainer = element.querySelector('.row.row-cols-1.row-cols-md-3.row-cols-lg-4.g-4');
  if (cardsContainer) {
    Array.from(cardsContainer.children).forEach(col => {
      const card = col.querySelector('.partner_card');
      if (!card) return;
      // First cell: image
      const img = card.querySelector('.img-area img');
      const imgEl = img || '';

      // Second cell: structured text content
      const cardBody = card.querySelector('.partner_card_body');
      const textFragments = [];
      if (cardBody) {
        // Title in strong
        const titleDiv = cardBody.querySelector('.partner_title');
        if (titleDiv && titleDiv.textContent.trim()) {
          const strong = document.createElement('strong');
          strong.textContent = titleDiv.textContent.trim();
          textFragments.push(strong);
        }
        // Add any additional non-title text (if present)
        // (In the current HTML, only the title exists, but this keeps things robust)
        Array.from(cardBody.childNodes).forEach(node => {
          if (
            node !== titleDiv &&
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim()
          ) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            textFragments.push(p);
          }
        });
      }
      // Ensure the cell is never empty (blank string if needed)
      rows.push([imgEl, textFragments.length ? textFragments : '']);
    });
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}