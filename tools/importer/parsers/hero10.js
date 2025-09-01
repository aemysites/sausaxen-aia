/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Hero (hero10)'];

  // Find the banner container
  const bannerDiv = element.querySelector('.banner');

  // Row 2: Background image (desktop first, fallback to any img)
  let bgImg = null;
  if (bannerDiv) {
    bgImg = bannerDiv.querySelector('img[id="mbbannerwithtxtdxtp"]') || bannerDiv.querySelector('img');
  }
  const bgImgRow = [bgImg ? bgImg : ''];

  // Row 3: Text content (container with heading and T&C)
  let textContent = '';
  if (bannerDiv) {
    const content = bannerDiv.querySelector('.content');
    if (content) {
      const container = content.querySelector('.container-bs.internal_promo_image');
      if (container) {
        textContent = container;
      }
    }
  }
  const textRow = [textContent ? textContent : ''];

  // Compose the table structure
  const cells = [
    headerRow,
    bgImgRow,
    textRow,
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
