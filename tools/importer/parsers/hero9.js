/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matches the block name
  const headerRow = ['Hero (hero9)'];

  // --- IMAGE ROW ---
  // Find the main image (prefer desktop, fallback to mobile)
  let imageEl = null;
  const bannerDiv = element.querySelector('.banner');
  if (bannerDiv) {
    imageEl = bannerDiv.querySelector('img#mbbannerwithtxtdxtp');
    if (!imageEl) {
      imageEl = bannerDiv.querySelector('img#bannerwithtxtmb');
    }
  }
  // If no image found, leave cell empty
  const imageRow = [imageEl || ''];

  // --- TEXT CONTENT ROW ---
  // Find the content container
  let textElements = [];
  if (bannerDiv) {
    const contentDiv = bannerDiv.querySelector('.content .container-bs');
    if (contentDiv) {
      // Retain existing elements, filter out empty <p>&nbsp;</p>
      for (const child of contentDiv.children) {
        if (
          child.tagName === 'P' &&
          (child.innerHTML === '&nbsp;' || child.textContent.trim() === '')
        ) {
          continue;
        }
        textElements.push(child);
      }
    }
  }
  // If no text elements, leave cell empty
  const textRow = [textElements.length > 0 ? textElements : '' ];

  // Compose rows: header, image, text content
  const rows = [headerRow, imageRow, textRow];

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}