/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header
  const headerRow = ['Hero (hero10)'];

  // Find all images directly under .banner, prefer first (desktop)
  let backgroundImgEl = null;
  const bannerDiv = element.querySelector('.banner');
  if (bannerDiv) {
    const imgs = bannerDiv.querySelectorAll('img');
    if (imgs.length) {
      backgroundImgEl = imgs[0];
    }
  }

  // Get text content: .banner .content .container-bs.internal_promo_image
  let textContentEl = null;
  if (bannerDiv) {
    const contentDiv = bannerDiv.querySelector('.content');
    if (contentDiv) {
      const promo = contentDiv.querySelector('.container-bs.internal_promo_image');
      if (promo) {
        textContentEl = promo;
      }
    }
  }

  // Fallbacks for missing elements
  const imgCell = backgroundImgEl ? backgroundImgEl : '';
  const textCell = textContentEl ? textContentEl : '';

  // Table rows as per specification: header, image, text
  const cells = [
    headerRow,
    [imgCell],
    [textCell]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
