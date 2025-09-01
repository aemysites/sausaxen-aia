/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main banner container (likely the only major child)
  let banner = element.querySelector('.banner');
  if (!banner) banner = element;

  // Find the best/most visible hero image (prefer desktop, fallback to first image)
  let imgs = banner.querySelectorAll('img');
  let heroImg = Array.from(imgs).find(img => img.id === 'mbbannerwithtxtdxtp') || imgs[0];

  // For text content: take all direct children with class *-text (web, tablet, mobile)
  // Each may hold headings/text, sometimes duplicated -- include all visible to maximize text extraction flexibility
  let contentContainer = banner.querySelector('.content.partner-banner');
  let textBlocks = [];
  if (contentContainer) {
    let textContainers = contentContainer.querySelectorAll('[class*="partner-banner-"][class$="-text"]');
    textBlocks = Array.from(textContainers).filter(e => e.textContent.trim());
  }
  // If none found, fallback to any headings in the banner
  if (textBlocks.length === 0) {
    let headings = banner.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    if (headings.length) {
      let div = document.createElement('div');
      headings.forEach(node => div.appendChild(node));
      textBlocks = [div];
    }
  }
  if (textBlocks.length === 0) {
    textBlocks = [document.createElement('div')];
  }

  // Build table
  const cells = [
    ['Hero (hero4)'],
    [heroImg],
    [textBlocks.length === 1 ? textBlocks[0] : textBlocks]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
