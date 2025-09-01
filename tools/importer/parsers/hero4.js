/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main banner block
  const bannerBlock = element.querySelector('.partnerBannerWithText');
  if (!bannerBlock) return;

  // Find the .banner div, which contains images and content
  const bannerDiv = bannerBlock.querySelector('.banner');
  if (!bannerDiv) return;

  // Get the first img as the background image for desktop
  const imgEls = bannerDiv.querySelectorAll('img');
  const backgroundImg = imgEls.length > 0 ? imgEls[0] : null;

  // Collect all text content that might be displayed as headline, subhead, etc.
  // Try to get the most relevant text (web, then mobile, then tablet)
  let textElements = [];
  const webText = bannerDiv.querySelector('.partner-banner-web-text');
  if (webText && webText.textContent.trim().length > 0) {
    textElements.push(webText);
  }
  const mobileText = bannerDiv.querySelector('.partner-banner-mobile-text');
  if (mobileText && mobileText.textContent.trim().length > 0) {
    textElements.push(mobileText);
  }
  const tabletText = bannerDiv.querySelector('.partner-banner-tablet-text');
  if (tabletText && tabletText.textContent.trim().length > 0) {
    textElements.push(tabletText);
  }
  // If none found, fallback to any h1/h2/h3 inside bannerDiv
  if (textElements.length === 0) {
    textElements = Array.from(bannerDiv.querySelectorAll('h1, h2, h3, p'));
  }

  // Compose the table rows; all content referenced directly
  const rows = [
    ['Hero (hero4)'],
    [backgroundImg ? backgroundImg : ''],
    [textElements.length > 0 ? textElements : '']
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
