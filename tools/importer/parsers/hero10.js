/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table Header: matches exactly
  const headerRow = ['Hero (hero10)'];

  // 2. Image extraction: prefer desktop, then mobile, fallback first img
  const imgs = element.querySelectorAll('img');
  let heroImg = null;
  // Prefer desktop image if present
  heroImg = Array.from(imgs).find(img => img.id === 'mbbannerwithtxtdxtp');
  if (!heroImg) {
    heroImg = Array.from(imgs).find(img => img.id === 'bannerwithtxtmb');
  }
  if (!heroImg && imgs.length > 0) {
    heroImg = imgs[0];
  }
  // Ensure the row is always present
  const imageRow = [heroImg ? heroImg : ''];

  // 3. Content extraction: headline, subheadline, etc.
  // Try to find the main content container
  let contentBlock = element.querySelector('.content .container-bs');
  if (!contentBlock) {
    // Fallback: collect all h1, h2, h3, p inside element (preserving order)
    const contentEls = [];
    element.querySelectorAll('h1, h2, h3, p').forEach(el => {
      contentEls.push(el);
    });
    // If we found any content, wrap in a div for the cell
    if (contentEls.length) {
      const div = document.createElement('div');
      contentEls.forEach(el => div.appendChild(el));
      contentBlock = div;
    } else {
      contentBlock = document.createElement('div'); // empty fallback
    }
  }
  // Final: rows definition
  const tableRows = [
    headerRow,
    imageRow,
    [contentBlock]
  ];

  // 4. Table creation
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // 5. Replace original element
  element.replaceWith(table);
}
