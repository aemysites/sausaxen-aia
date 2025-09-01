/* global WebImporter */
export default function parse(element, { document }) {
  // Get main/desktop image
  let mainImg = element.querySelector('img.card-img-top.main-img.child');
  if (!mainImg) {
    const imgs = element.querySelectorAll('img');
    mainImg = imgs.length > 0 ? imgs[0] : null;
  }

  // Get overlay content block
  let overlayContent = null;
  const overlay = element.querySelector('.card-img-overlay');
  if (overlay) {
    // Use the .text-left block if present, else overlay itself
    const textLeft = overlay.querySelector('.text-left');
    overlayContent = textLeft ? textLeft : overlay;
  }

  // Compose content for text/CTA cell
  let contentCell = '';
  if (overlayContent) {
    // Collect all direct children of overlayContent
    // This ensures any headings, paragraphs, buttons, etc, are included
    const children = Array.from(overlayContent.children).filter(child => {
      // Only keep elements that are not empty (unless they're links, which should be included always)
      if (child.tagName === 'A') return true;
      if (child.textContent && child.textContent.trim().length > 0) return true;
      return false;
    });
    contentCell = children.length ? children : '';
  }

  const cells = [
    ['Hero (hero8)'],
    [mainImg ? mainImg : ''],
    [contentCell]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
