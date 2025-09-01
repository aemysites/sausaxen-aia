/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: Block name matches example
  const headerRow = ['Hero (hero8)'];

  // 2nd row: Background image (desktop preferred, fallback to mobile)
  let bgImg = null;
  const imgDesktop = element.querySelector('img.card-img-top.main-img.child');
  if (imgDesktop) {
    bgImg = imgDesktop;
  } else {
    const imgMobile = element.querySelector('img.main-img-mobile');
    if (imgMobile) {
      bgImg = imgMobile;
    }
  }

  // 3rd row: Title, Description (even if empty), CTA
  const overlay = element.querySelector('.card-img-overlay');
  const contentElems = [];
  if (overlay) {
    // Heading (span; upgrade to h1)
    const heading = overlay.querySelector('span.banner-left-heading');
    if (heading) {
      const h1 = document.createElement('h1');
      h1.textContent = heading.textContent;
      contentElems.push(h1);
    }
    // Description (paragraph; include even if empty)
    const description = overlay.querySelector('p.banner-left-description');
    if (description) {
      contentElems.push(description);
    }
    // CTA link (a)
    const cta = overlay.querySelector('a');
    if (cta) {
      contentElems.push(cta);
    }
  }

  // Compose table rows
  const rowImage = [bgImg ? bgImg : ''];
  const rowContent = [contentElems.length ? contentElems : ''];

  const cells = [
    headerRow,
    rowImage,
    rowContent
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
