/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns3)'];

  // Find all main column sets (accordion groups of links) for the first two rows
  // There are three main grid containers at the top with link columns
  // Each .container.responsivegrid > .cmp-container > .aem-Grid > .footerComponent
  const gridContainers = Array.from(element.querySelectorAll('.container.responsivegrid'));
  let mainColumns = [];
  // First two grid containers each contain a .cmp-container with .aem-Grid of 4 .footerComponent columns
  for (let i = 0; i < 2; i++) {
    const cmpContainer = gridContainers[i] && gridContainers[i].querySelector('.cmp-container');
    if (cmpContainer) {
      const grid = cmpContainer.querySelector('.aem-Grid');
      if (grid) {
        const cols = Array.from(grid.querySelectorAll(':scope > .footerComponent'));
        if(cols.length === 4) {
          mainColumns.push(cols);
        }
      }
    }
  }

  // Third grid container is for legal and social links
  // #socialWrap > .aem-Grid > .footerComponent (4 columns)
  let legalSocialColumns = [];
  const socialWrap = element.querySelector('#socialWrap');
  if (socialWrap) {
    const grid = socialWrap.querySelector('.aem-Grid');
    if (grid) {
      const cols = Array.from(grid.querySelectorAll(':scope > .footerComponent'));
      // The first 3 are legal link columns, last is social
      if (cols.length === 4) {
        legalSocialColumns = cols;
      }
    }
  }

  // Logos row: Tata, Air India, Star Alliance
  // Tata logo
  let tataLogo = '';
  const tataSection = element.querySelector('#tatasection');
  if (tataSection) {
    const tataImg = tataSection.querySelector('img');
    if (tataImg) {
      tataLogo = tataImg.closest('a') || tataImg;
    }
  }
  // Air India logo and Star Alliance logo
  let airIndiaLogo = '';
  let starAllianceLogo = '';
  const footerRight = element.querySelector('#footer_right');
  if (footerRight) {
    const imgs = footerRight.querySelectorAll('img');
    if (imgs.length > 0) {
      airIndiaLogo = imgs[0];
    }
    // Star Alliance is in a link (third 'CustomImage')
    const saLink = footerRight.querySelector('a');
    if (saLink) {
      starAllianceLogo = saLink;
    }
  }

  // Copyright row: get the cmp-text with copyright
  let copyright = '';
  const copyrightTxt = element.querySelector('#copyrightTxt');
  if (copyrightTxt) copyright = copyrightTxt;

  // Compose the rows for columns3
  const cells = [
    headerRow,
    // First row: ABOUT US, BOOK & MANAGE, WHERE WE FLY, PREPARE TO TRAVEL
    mainColumns[0] || ['', '', '', ''],
    // Second row: AIR INDIA EXPERIENCE, MAHARAJA CLUB, SUPPORT, AIR INDIA APP
    mainColumns[1] || ['', '', '', ''],
    // Third row: Sitemap, Cookie, Travel Agents, Social
    legalSocialColumns.length ? legalSocialColumns : ['', '', '', ''],
    // Logos row: Tata, Air India, Star Alliance
    [tataLogo, airIndiaLogo, starAllianceLogo],
    // Copyright row
    [copyright]
  ];

  // Construct the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
