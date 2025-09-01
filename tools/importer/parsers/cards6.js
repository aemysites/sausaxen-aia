/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Create exact header as the example, single column
  const headerRow = ['Cards (cards6)'];

  // 2. Find the container holding the card columns
  const cardsContainer = element.querySelector('.row.row-cols-1.row-cols-md-3.row-cols-lg-4.g-4');
  if (!cardsContainer) return;
  const cardCols = Array.from(cardsContainer.children);

  // 3. For each card, extract image and visible text content
  const rows = cardCols.map(col => {
    // Find the anchor element containing image and title
    const cardLink = col.querySelector('a.card-icon') || col.querySelector('a');
    if (!cardLink) return null;

    // Image extraction: always present, keep the original element
    const img = cardLink.querySelector('img');

    // Text extraction: find all partner_card_body and use any text inside (title, description)
    const cardBody = cardLink.querySelector('.partner_card_body') || col.querySelector('.partner_card_body');
    let textCellContents = [];
    if (cardBody) {
      // Extract the title
      const titleDiv = cardBody.querySelector('.partner_title');
      if (titleDiv && titleDiv.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleDiv.textContent.trim();
        textCellContents.push(strong);
      }
      // Extract any additional non-empty text nodes directly under cardBody (as description)
      Array.from(cardBody.childNodes).forEach(node => {
        if (node.nodeType === 3 && node.textContent.trim()) {
          // Text node
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          textCellContents.push(document.createElement('br'), span);
        }
      });
    }
    // Fallback: if no cardBody, look for visible text in col
    if (textCellContents.length === 0) {
      const text = cardLink.textContent.trim();
      if (text) textCellContents = [text];
    }
    // Compose the card row: [image, text cell]
    return [img, textCellContents];
  }).filter(row => row && row[0]); // Only keep valid rows (with image)

  // 4. Build the final table for the block
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // 5. Replace the original element
  element.replaceWith(block);
}
