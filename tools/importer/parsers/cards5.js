/* global WebImporter */
export default function parse(element, { document }) {
  // Find the card grid container
  const cardsContainer = element.querySelector('.row.row-cols-1.row-cols-md-3.row-cols-lg-4.g-4');
  if (!cardsContainer) return;
  const cardCols = Array.from(cardsContainer.children).filter(col => col.classList.contains('col'));

  // Header row as a single cell (not two columns), per requirements
  const rows = [['Cards (cards5)']];

  cardCols.forEach(col => {
    // Get anchor link for the card
    const cardLink = col.querySelector('.partner_card a.card-icon');
    if (!cardLink) return;

    // First cell: the image element referenced directly from the DOM
    const imgEl = cardLink.querySelector('.img-area img');

    // Second cell: all text content (title, etc)
    const body = cardLink.querySelector('.partner_card_body');
    let cellElements = [];
    if (body) {
      // Title - use <strong>
      const titleEl = body.querySelector('.partner_title');
      if (titleEl) {
        const strong = document.createElement('strong');
        strong.textContent = titleEl.textContent.trim();
        cellElements.push(strong);
      }
      // If there are more nodes, include them after the title
      Array.from(body.childNodes).forEach(node => {
        if (node !== titleEl && node.nodeType === Node.TEXT_NODE) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          if (span.textContent) cellElements.push(span);
        } else if (node !== titleEl && node.nodeType === Node.ELEMENT_NODE) {
          cellElements.push(node);
        }
      });
    }
    if (cellElements.length === 0 && cardLink.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = cardLink.textContent.trim();
      cellElements.push(strong);
    }

    // Push row as two columns: [img, textContent]
    rows.push([imgEl, cellElements.length === 1 ? cellElements[0] : cellElements]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
