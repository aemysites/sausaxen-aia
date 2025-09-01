/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name as a single cell
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // Find the grid containing all cards
  const grid = element.querySelector('.row.row-cols-1.row-cols-md-3.row-cols-lg-4.g-4');
  if (!grid) return;

  // Select all card columns directly under the grid
  const cardCols = grid.querySelectorAll(':scope > .col');
  cardCols.forEach((col) => {
    // Find the image in the card (mandatory)
    const img = col.querySelector('img');
    // Find the card body that may contain text content
    const cardBody = col.querySelector('.partner_card_body');
    let textCell = [];
    if (cardBody) {
      // Look for a title div
      const titleDiv = cardBody.querySelector('.partner_title');
      if (titleDiv) {
        // Use <strong> for the heading
        const strong = document.createElement('strong');
        strong.textContent = titleDiv.textContent.trim();
        textCell.push(strong);
      }
      // Collect all additional text nodes after the title
      Array.from(cardBody.childNodes).forEach((node) => {
        if (
          node !== titleDiv &&
          node.nodeType === Node.TEXT_NODE &&
          node.textContent.trim().length > 0
        ) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          textCell.push(span);
        }
        // Any other elements that are not the title
        if (
          node !== titleDiv &&
          node.nodeType === Node.ELEMENT_NODE &&
          node !== titleDiv &&
          node.textContent.trim().length > 0
        ) {
          textCell.push(node);
        }
      });
    }
    // If no title or body, fallback to empty cell
    if (textCell.length === 0) textCell = '';
    // Add row: [image, text cell]
    rows.push([
      img,
      textCell.length === 1 ? textCell[0] : textCell
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
