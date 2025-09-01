/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Safely get all main footer navigation columns
  function getMainColumns() {
    const blocks = [];
    // Select top-level footer columns (excluding app column)
    const containers = element.querySelectorAll('.container.responsivegrid.container-bs .cmp-container');
    containers.forEach(container => {
      const grid = container.querySelector('.aem-Grid');
      if (grid) {
        grid.querySelectorAll('.footerComponent').forEach(comp => {
          const headerBtn = comp.querySelector('.accordion-header .accordion-button');
          if (!headerBtn || !/app/i.test(headerBtn.textContent)) {
            blocks.push(comp); // Reference the original block for all text, headings, lists, links
          }
        });
      }
    });
    return blocks;
  }
  // Helper: Get Air India App block (entire block for consistency, not just body)
  function getAppColumn() {
    let result = null;
    const containers = element.querySelectorAll('.container.responsivegrid.container-bs .cmp-container');
    containers.forEach(container => {
      const grid = container.querySelector('.aem-Grid');
      if (grid) {
        grid.querySelectorAll('.footerComponent').forEach(comp => {
          const headerBtn = comp.querySelector('.accordion-header .accordion-button');
          if (headerBtn && /app/i.test(headerBtn.textContent)) {
            result = comp;
          }
        });
      }
    });
    return result;
  }
  // Helper: Get all bottom legal columns (Sitemap, Cookie Policy, Travel Agents)
  function getLegalColumns() {
    const result = [];
    const grid = element.querySelector('#socialWrap .aem-Grid');
    if (grid) {
      grid.querySelectorAll('.footerComponent').forEach(comp => {
        // Only blocks that have .accordion-body (legal sections)
        if (comp.querySelector('.accordion-body')) {
          result.push(comp);
        }
      });
    }
    return result;
  }
  // Helper: Get Social block (Follow Us On)
  function getSocialBlock() {
    let result = null;
    const grid = element.querySelector('#socialWrap .aem-Grid');
    if (grid) {
      grid.querySelectorAll('.footerComponent').forEach(comp => {
        const headerBtn = comp.querySelector('.accordion-header .accordion-button');
        if (headerBtn && /follow/i.test(headerBtn.textContent)) {
          result = comp;
        }
      });
    }
    return result;
  }
  // Helper: Get logos (Tata, Air India, Star Alliance) and copyright
  function getLogosAndCopyright() {
    const container = document.createElement('div');
    const tata = element.querySelector('#tatasection');
    if (tata) container.appendChild(tata);
    const airIndia = element.querySelector('#footer_right');
    if (airIndia) container.appendChild(airIndia);
    const copyright = element.querySelector('#copyrightTxt');
    if (copyright) container.appendChild(copyright);
    return container;
  }
  // Compose table structure
  const headerRow = ['Columns (columns3)']; // Header matches example exactly
  // Row 2: main columns block (nav columns, all text, links, lists) | Air India App + Social
  const leftCol1 = getMainColumns(); // All nav columns as array
  const rightCol1Arr = [];
  const appBlock = getAppColumn();
  if (appBlock) rightCol1Arr.push(appBlock);
  const socialBlock = getSocialBlock();
  if (socialBlock) rightCol1Arr.push(socialBlock);
  // Row 3: legal columns (all text, links, lists) | logos and copyright
  const leftCol2 = getLegalColumns();
  const rightCol2Arr = [];
  const logosCopyright = getLogosAndCopyright();
  if (logosCopyright && logosCopyright.childNodes.length) rightCol2Arr.push(logosCopyright);
  // Assemble block table
  const cells = [
    headerRow,
    [leftCol1, rightCol1Arr],
    [leftCol2, rightCol2Arr],
  ];
  // Replace source element with table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
