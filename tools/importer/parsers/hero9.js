/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as in the example
  const headerRow = ['Hero (hero9)'];

  // Find the .banner div that contains images and text
  const bannerDiv = element.querySelector('.banner');
  let mainImage = null;

  if (bannerDiv) {
    // Try to get the first image (desktop preferred)
    const images = Array.from(bannerDiv.querySelectorAll('img'));
    if (images.length) {
      // Use the first image as the background
      mainImage = images[0];
    }
  }

  // Second row: background image element or empty if not found
  const backgroundRow = [mainImage ? mainImage : ''];

  // Third row: text content (use the .container-bs div inside .content)
  let textContent = '';
  if (bannerDiv) {
    const textContainer = bannerDiv.querySelector('.content .container-bs');
    if (textContainer) {
      textContent = textContainer;
    }
  }

  const textRow = [textContent ? textContent : ''];

  // Assemble the table as per block spec
  const cells = [
    headerRow,
    backgroundRow,
    textRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(block);
}
