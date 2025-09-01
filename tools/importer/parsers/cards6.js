/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards6)'];
  const cardsRows = [];

  // Find the cards container
  const cardsContainer = element.querySelector('.row.row-cols-1');
  if (!cardsContainer) return;

  // Get all card columns
  const cardCols = cardsContainer.querySelectorAll(':scope > .col');

  cardCols.forEach((col) => {
    // Find the anchor that wraps image and card body
    const cardLink = col.querySelector('a.card-icon');
    if (!cardLink) return;

    // Find image
    const img = cardLink.querySelector('img');

    // Build text cell: Capture title plus ANY additional descriptive text from partner_card_body
    const cardBody = cardLink.querySelector('.partner_card_body');
    let textCell = [];
    if (cardBody) {
      // Title as heading
      const title = cardBody.querySelector('.partner_title');
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }
      // Collect any remaining non-title text nodes and elements in partner_card_body (future-proof for description)
      Array.from(cardBody.childNodes).forEach((node) => {
        if (node !== title) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            textCell.push(p);
          } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('partner_title')) {
            textCell.push(node);
          }
        }
      });
    }
    cardsRows.push([img, textCell.length ? textCell : '']);
  });

  const cells = [headerRow, ...cardsRows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
