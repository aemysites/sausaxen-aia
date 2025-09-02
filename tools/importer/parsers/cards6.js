/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards6)'];
  // Find the cards container
  const cardsContainer = element.querySelector('.row.row-cols-1.row-cols-md-3.row-cols-lg-4');
  if (!cardsContainer) return;
  // Get all card columns
  const cardCols = Array.from(cardsContainer.children).filter(col => col.classList.contains('col'));
  const rows = [headerRow];
  cardCols.forEach(col => {
    const partnerCard = col.querySelector('.partner_card');
    if (!partnerCard) return;
    // Image extraction
    let imgEl = null;
    const imgArea = partnerCard.querySelector('.img-area');
    if (imgArea) {
      imgEl = imgArea.querySelector('img');
    }
    // Text content extraction: include all content from .partner_card_body
    let textCell = '';
    const cardBody = partnerCard.querySelector('.partner_card_body');
    if (cardBody) {
      // Use the actual cardBody element to preserve all structure and text (title, description, CTA, etc.)
      textCell = cardBody;
    }
    // Only add row if image or text is present
    if (imgEl || (textCell && textCell.textContent.trim().length > 0)) {
      rows.push([imgEl, textCell]);
    }
  });
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
