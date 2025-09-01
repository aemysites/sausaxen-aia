/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as in example
  const headerRow = ['Hero (hero9)'];

  // Find the background image: Use the first <img> in the banner section
  let bgImg = null;
  const bannerDiv = element.querySelector('.banner');
  if (bannerDiv) {
    const imgs = bannerDiv.querySelectorAll('img');
    if (imgs.length > 0) {
      bgImg = imgs[0]; // reference the existing <img> element
    }
  }

  // Find the content: The .content .container-bs internal_promo_image div (contains h1, etc)
  let contentDiv = null;
  const contentContainer = element.querySelector('.content .container-bs.internal_promo_image');
  if (contentContainer) {
    contentDiv = contentContainer;
  } else {
    // Fallback: search for h1 and use its parent
    const h1 = element.querySelector('h1');
    if (h1) {
      contentDiv = h1.parentElement;
    }
  }

  // If either bgImg or contentDiv is missing, put null so the table row still exists
  const rows = [
    headerRow,
    [bgImg || ''],
    [contentDiv || '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
