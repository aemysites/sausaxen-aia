/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first non-empty image (prefer desktop, fallback to mobile)
  function getImage() {
    let img = element.querySelector('img.card-img-top');
    if (img && img.getAttribute('src')) return img;
    img = element.querySelector('img.main-img-mobile');
    if (img && img.getAttribute('src')) return img;
    return null;
  }

  // Header row exactly as required
  const headerRow = ['Hero (hero8)'];

  // Background image row
  const imageEl = getImage();
  const imageRow = [imageEl ? imageEl : ''];

  // Main content (title, subheading, CTA)
  let contentCell = '';
  const overlay = element.querySelector('.card-img-overlay');
  if (overlay) {
    // Find the most relevant container holding heading/text/button
    const textBlock = overlay.querySelector('.text-left') || overlay;
    // Only reference if it has actual content
    if (textBlock && (textBlock.textContent.trim() || textBlock.querySelector('a'))) {
      contentCell = textBlock;
    }
  }
  const contentRow = [contentCell];

  // Compose the table as per the guidelines
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
