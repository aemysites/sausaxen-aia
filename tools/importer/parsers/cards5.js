/* global WebImporter */
export default function parse(element, { document }) {
  // Exact header row, single column
  const headerRow = ['Cards (cards5)'];

  // Find the card grid container
  const cardsContainer = element.querySelector('.row.row-cols-1.row-cols-md-3.row-cols-lg-4.g-4');
  if (!cardsContainer) return;

  // Get all card columns
  const cardCols = Array.from(cardsContainer.children).filter(col => col.classList.contains('col'));

  const rows = [headerRow];

  cardCols.forEach(col => {
    const card = col.querySelector('.partner_card');
    if (!card) return;
    // Image cell
    const img = card.querySelector('img');
    const imageCell = img || '';
    // Text cell: collect all text in the card (title and any subtitle/desc)
    const body = card.querySelector('.partner_card_body');
    let textCell;
    if (body) {
      const parts = [];
      // Title: partner_title
      const titleDiv = body.querySelector('.partner_title');
      if (titleDiv && titleDiv.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleDiv.textContent.trim();
        parts.push(strong);
      }
      // If there is other descriptive text below the title, add it (future-proofing)
      Array.from(body.childNodes).forEach(child => {
        if (child !== titleDiv && child.nodeType === 3 && child.textContent.trim()) {
          // Text node after title
          const span = document.createElement('span');
          span.textContent = child.textContent.trim();
          parts.push(span);
        }
        if (child !== titleDiv && child.nodeType === 1 && child.textContent.trim()) {
          // Element node after title (description etc)
          parts.push(child);
        }
      });
      textCell = parts.length ? parts : '';
    } else {
      textCell = '';
    }
    rows.push([imageCell, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
