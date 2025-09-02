/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main partnerBannerWithText block
  const partnerBanner = element.querySelector('.partnerBannerWithText');
  if (!partnerBanner) return;
  const banner = partnerBanner.querySelector('.banner');
  if (!banner) return;

  // Get the FIRST image in the banner for the background image
  const bgImg = banner.querySelector('img');

  // Try to get all major text containers: web, tablet, mobile
  // The example expects all headline/subheading/para content in one cell
  // We'll combine all text blocks if present
  const textBlocks = [];
  const webText = banner.querySelector('.partner-banner-web-text');
  if (webText) textBlocks.push(webText);
  const tabletText = banner.querySelector('.partner-banner-tablet-text');
  if (tabletText) textBlocks.push(tabletText);
  const mobileText = banner.querySelector('.partner-banner-mobile-text');
  if (mobileText) textBlocks.push(mobileText);

  // If none of the above exist, fallback to all direct children in .content .container-bs
  if (textBlocks.length === 0) {
    const fallbackBlocks = banner.querySelectorAll('.content .container-bs > *');
    if (fallbackBlocks.length) {
      textBlocks.push(...fallbackBlocks);
    } else {
      // Final fallback: all children in .content
      const content = banner.querySelector('.content');
      if (content) {
        textBlocks.push(...content.children);
      }
    }
  }

  // Build the table rows according to example: header, image, text
  const rows = [
    ['Hero (hero4)'], // Header row EXACTLY as in example
    [bgImg || ''],   // Background image row (image element or empty string)
    [textBlocks.length ? textBlocks : ''] // All text blocks in one cell
  ];

  // Create and replace with the new table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
