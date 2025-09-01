/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row exactly as in the example
  const headerRow = ['Cards (cards6)'];
  const cells = [headerRow];

  // Find the container holding the card columns
  const cardsContainer = element.querySelector(
    '.row.row-cols-1.row-cols-md-3.row-cols-lg-4.g-4'
  );
  if (!cardsContainer) return;

  // Process each card column
  Array.from(cardsContainer.children).forEach((col) => {
    // Find the partner card inside
    const partnerCard = col.querySelector('.partner_card');
    if (!partnerCard) return;

    // Get the image element directly from DOM
    let img = null;
    const imgEl = partnerCard.querySelector('img');
    if (imgEl) img = imgEl;

    // Get the text content from the card body
    let textContent = [];
    const body = partnerCard.querySelector('.partner_card_body');
    if (body) {
      // Title as strong (matches semantic meaning in example)
      const titleDiv = body.querySelector('.partner_title');
      if (titleDiv && titleDiv.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleDiv.textContent.trim();
        textContent.push(strong);
      }
      // If there are other elements (future-proof), include them too
      Array.from(body.childNodes).forEach((node) => {
        if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent.trim() &&
          (!titleDiv || node !== titleDiv)
        ) {
          // Add text node content if not empty
          textContent.push(document.createTextNode(node.textContent.trim()));
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          (!titleDiv || node !== titleDiv)
        ) {
          textContent.push(node);
        }
      });
    }
    if (!textContent.length) textContent = '';
    cells.push([img, textContent]);
  });

  // Create and replace the element with the new table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
