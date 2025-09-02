/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches exactly as in the example
  const headerRow = ['Hero (hero10)'];

  // Find the banner image: prefer desktop first, fallback to mobile if needed
  let heroImg = null;
  const bannerDiv = element.querySelector('.banner');
  if (bannerDiv) {
    const imgs = bannerDiv.querySelectorAll('img');
    // Use the first non-empty img (desktop preferred)
    heroImg = imgs[0] || null;
  }

  // 2nd row: image only (if image exists, otherwise empty string)
  const imageRow = [heroImg || ''];

  // 3rd row: all promo text (h1, p, etc) from content
  let contentRowEl = null;
  if (bannerDiv) {
    // Target the inner promo container if found
    const promoContainer = bannerDiv.querySelector('.content .container-bs.internal_promo_image');
    // Use promoContainer if it exists and has children
    if (promoContainer && promoContainer.children.length > 0) {
      contentRowEl = promoContainer;
    } else {
      // fallback to entire .content block
      const contentDiv = bannerDiv.querySelector('.content');
      if (contentDiv && contentDiv.children.length > 0) {
        contentRowEl = contentDiv;
      }
    }
  }
  // If nothing found, fallback to empty string
  const contentRow = [contentRowEl || ''];

  // Compose the cells for the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
