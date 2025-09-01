/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: matches example, only one column
  const headerRow = ['Hero (hero4)'];

  // --- IMAGE ROW ---
  // Find the most prominent image
  // Prefer images inside a banner sub-block, fallback to first image found
  let img = null;
  let bannerImgCandidates = element.querySelectorAll('img');
  if (bannerImgCandidates.length > 0) {
    img = bannerImgCandidates[0];
  }
  const imageRow = [img ? img : ''];

  // --- CONTENT ROW ---
  // Gather all text content for hero text from the relevant block
  // Prefer .partner-banner-web-text, else mobile/tablet, else fallback to most relevant div
  let textBlock = element.querySelector('.partner-banner-web-text')
              || element.querySelector('.partner-banner-mobile-text')
              || element.querySelector('.partner-banner-tablet-text');
  // If all above fail, fallback to the first div containing a heading
  if (!textBlock) {
    textBlock = Array.from(element.querySelectorAll('div')).find(div =>
      div.querySelector('h1, h2, h3, h4, h5, h6, p')
    );
  }
  // If still missing, fallback to the element itself
  if (!textBlock) {
    textBlock = element;
  }
  // Place the entire content block in the cell, preserving semantic meaning
  const contentRow = [textBlock];

  // Compose the table rows
  const cells = [headerRow, imageRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
