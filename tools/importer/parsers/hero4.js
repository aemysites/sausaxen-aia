/* global WebImporter */
export default function parse(element, { document }) {
  // Find the block root
  const bannerBlock = element.querySelector('.partnerBannerWithText');
  if (!bannerBlock) return;

  // Find .banner inside block
  const banner = bannerBlock.querySelector('.banner');
  if (!banner) return;

  // Find background image (prefer desktop)
  const imgs = banner.querySelectorAll('img');
  const bgImg = imgs.length > 0 ? imgs[0] : null;

  // Find the text content block
  const content = banner.querySelector('.content.partner-banner');
  let textContentEls = [];
  if (content) {
    // Find all variations: .partner-banner-web-text, .partner-banner-tablet-text, .partner-banner-mobile-text
    const allTextBlocks = content.querySelectorAll('.partner-banner-web-text, .partner-banner-tablet-text, .partner-banner-mobile-text');
    allTextBlocks.forEach(block => {
      // Collect only element children (not comments or empty text nodes)
      Array.from(block.childNodes).forEach(node => {
        if (node.nodeType === 1 && node.textContent.trim()) {
          textContentEls.push(node);
        }
      });
    });
    // If nothing found, fallback to all element children of content
    if (textContentEls.length === 0) {
      Array.from(content.children).forEach(node => {
        if (node.textContent.trim()) {
          textContentEls.push(node);
        }
      });
    }
  }

  // Build table rows
  const rows = [];
  // 1. Header row, must match example exactly
  rows.push(['Hero (hero4)']);
  // 2. Image row (background image)
  rows.push([bgImg ? bgImg : '']);
  // 3. Text row (all text elements grouped)
  rows.push([textContentEls.length > 0 ? textContentEls : '']);

  // Create table and replace
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
